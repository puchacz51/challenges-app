import formidable, { File as FormFile } from 'formidable';
import next, { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import {
  SupabaseClient,
  User,
  createServerSupabaseClient,
} from '@supabase/auth-helpers-nextjs';
import { ChallengeCategory, ChallengeInsert } from '../../types/challengeTypes';
import { randomUUID } from 'crypto';
import { Database } from '../../services/supabase/schema';
import { ChallengeStepWithoutId } from '../../types/challengeFormTypes';
import { ChallengeStepInsert } from '../../types/challengeTypes';
import { incomingChallengeSchema } from '../../components/forms/validateIncomingChallenge';
import { readFileSync } from 'fs';
export const config = {
  api: {
    bodyParser: false,
    responseLimit: 2000000,
  },
};
let supabaseClient: SupabaseClient<Database>;
const handler: NextApiHandler = async (req, res) => {
  supabaseClient = createServerSupabaseClient({ req, res });

  if (req.method === 'POST') {
    try {
      await handlePostChallenge(req, res);
    } catch (err) {
      res.statusCode = 500;
      res.end(err?.message || 'something goes wrong try again later');
    }
    res.statusCode = 200;
    res.end('ok');
  }
};

export default handler;

const handlePostChallenge = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const {
    data: { session },
    error,
  } = await supabaseClient.auth.getSession();
  if (error || !session) {
    res.statusCode = 401;
    res.end('Unauthorized request');
  }
  const user = session.user;
  const { challengeFormData, challengeImages, challengeSteps } =
    await parseChallengeForm(req);

  // const { error: formError } = await validateChallengeSchema(challengeFormData);
  // if (formError) throw formError;

  const { data: imagesPaths, error: uploadImageError } = await UploadImages(
    challengeImages,
    user
  );
  if (uploadImageError) {
    if (imagesPaths.length) {
      removeImages(imagesPaths);
    }
    throw uploadImageError;
  }
  const challengeData = {
    ...challengeFormData,
    userId: user.id,
    images: imagesPaths,
  };

  const { error: addChallengeError, data: challengeId } =
    await addChallengeToDB(challengeData);
  if (addChallengeError) {
    removeImages(imagesPaths);
    throw addChallengeError;
  }

  if (!challengeSteps?.length) return;
  const { data, error: stepsError } = await addChallengeStepsToDB(
    challengeSteps,
    challengeId
  );
  if (stepsError) {
    await supabaseClient
      .from('challengeSteps')
      .delete()
      .eq('challengeId', challengeId);
    await removeImages(imagesPaths);
    throw stepsError;
  }
};

interface ParseChallengeForm {
  challengeFormData: ChallengeInsert;
  challengeImages: FormFile[] | null;
  challengeSteps: ChallengeStepInsert[] | null;
}

const parseChallengeForm = (req: NextApiRequest) => {
  return new Promise<ParseChallengeForm>((resolve, reject) => {
    let challengeFormData: ChallengeInsert;
    let challengeSteps: ChallengeStepInsert[] | null;
    let challengeImages: FormFile[] | null;
    const form = new formidable.IncomingForm({
      multiples: true,
    });
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        challengeFormData = {
          title: fields.title as string,
          description: fields.description as string,
          category: fields.category as ChallengeCategory,
          userId: fields.userId as string,
          isPublic: fields.isPublic === 'true',
          startTime: fields.startTime as string,
          endTime: fields.endTime as string,
        } as ChallengeInsert;
        if (fields.challengeSteps) {
          challengeSteps = JSON.parse(fields.challengeSteps as string);
        }

        const imagesFiles = files['images[]'];
        challengeImages = Array.isArray(imagesFiles)
          ? imagesFiles
          : [imagesFiles];
        const result = {
          challengeFormData,
          challengeImages,
          challengeSteps,
        };

        resolve(result);
      }
    });
  });
};

const validateChallengeSchema = async (challengeData: ChallengeInsert) => {
  try {
    await incomingChallengeSchema.validate(challengeData);
    return { error: null };
  } catch (err) {
    return { error: err };
  }
};
const generateImagePath = (imagesArray: FormFile[], userId: string) =>
  imagesArray.map((image) => {
    const imageId = randomUUID();
    const imageExtension = image.originalFilename.split('.').pop();
    const imagePath = `${userId}/${imageId}.${imageExtension}`;
    return { name: imageId, path: imagePath, image };
  });

const UploadImages = async (images: FormFile[], user: User) => {
  let successedPaths: string[];
  try {
    const imagesPaths = generateImagePath(images, user.id);
    let imageUploadPromises: Promise<string>[] = [];
    for (let { image, path } of imagesPaths) {
      imageUploadPromises.push(uploadImage(image, path));
    }
    const imagesUploadData = await Promise.allSettled(imageUploadPromises);
    if (imagesUploadData.find((imageRes) => imageRes.status === 'rejected')) {
      const fulfilledPromises = imagesUploadData.filter(
        (imageRes) => imageRes.status === 'fulfilled'
      ) as PromiseFulfilledResult<string>[];
      successedPaths = fulfilledPromises.map((fulfilled) => fulfilled.value);
      removeImages(successedPaths);
      throw new Error('image error');
    } else {
      successedPaths = (
        imagesUploadData as PromiseFulfilledResult<string>[]
      ).map((fullfilled) => fullfilled.value);
      return { data: successedPaths, error: null };
    }
  } catch (err) {
    if (successedPaths?.length) {
      removeImages(successedPaths);
    }

    return { data: successedPaths, error: err };
  }
};

const addChallengeToDB = async (challengeData: ChallengeInsert) => {
  const { data, error } = await supabaseClient
    .from('challenges')
    .insert(challengeData)
    .select();
  if (error) {
    return { data: null, error };
  }
  const { id: challengeId } = data[0];
  return { data: challengeId, error: null };
};

const addChallengeStepsToDB = async (
  challengeStepsData: ChallengeStepWithoutId[],
  challengeId: string
) => {
  const orderedSteps = challengeStepsData.map((step, index) => {
    return {
      ...step,
      challengeId: challengeId,
    } as ChallengeStepInsert;
  });
  const { data, error } = await supabaseClient
    .from('challengeSteps')
    .insert(orderedSteps);
  return { data, error };
};

const uploadImage = (image: FormFile, imageName: string) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const { data, error } = await supabaseClient.storage
        .from('challenges')
        .upload(imageName, readFileSync(image.filepath), {
          contentType: image.mimetype,
        });

      if (error) {
        throw error;
      }
      resolve(data.path);
    } catch (error) {
      reject(error);
    }
  });
};

const removeImages = async (imagesPaths: string[]) => {
  for (let imagePath of imagesPaths) {
    try {
      await removeImage(imagePath);
    } catch (err) {}
  }
};
const removeImage = async (imagePath: string) => {
  const { data, error } = await supabaseClient.storage
    .from('challenges')
    .remove([imagePath]);
};
