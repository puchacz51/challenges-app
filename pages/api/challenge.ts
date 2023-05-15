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
export const config = {
  api: {
    bodyParser: false,
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
  const { challengeData, challengeImages, challengeSteps } =
    await parseChallengeForm(req);
  const { error: formError } = await validateChallengeSchema(challengeData);
  if (formError) throw formError;
  const { data: imagesPaths, error: uploadImageError } = await UploadImages(
    challengeImages,
    user
  );
  if (uploadImageError) throw uploadImageError;
  const { error: addChallengeError, data: challengeId } =
    await addChallengeToDB(challengeData);
  if (addChallengeError) {
    removeImages(user.id, imagesPaths);
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
    await removeImages(user.id, imagesPaths);
    throw stepsError;
  }
};

interface ParseChallengeForm {
  challengeData: ChallengeInsert;
  challengeImages: FormFile[] | null;
  challengeSteps: ChallengeStepInsert[] | null;
}

const parseChallengeForm = (req: NextApiRequest) => {
  return new Promise<ParseChallengeForm>((resolve, reject) => {
    let challengeData: ChallengeInsert;
    let challengeSteps: ChallengeStepInsert[] | null;
    let challengeImages: FormFile[] | null;
    const form = new formidable.IncomingForm({ multiples: true });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        challengeData = {
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
        challengeImages = Array.isArray(files.images)
          ? files.images
          : [files.images];
        const result = {
          challengeData,
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
      removeImages(user.id, successedPaths);
      throw new Error('image error');
    } else {
      successedPaths = (
        imagesUploadData as PromiseFulfilledResult<string>[]
      ).map((fullfilled) => fullfilled.value);
      return { data: successedPaths, error: null };
    }
  } catch (err) {
    removeImages(user.id, successedPaths);
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
        .upload(imageName, image as unknown as File);
      if (error) {
        throw error;
      }
      resolve(data.path);
    } catch (error) {
      reject(error);
    }
  });
};

const removeImages = async (userId: string, imagesPaths: string[]) => {
  for (let imagePath of imagesPaths) {
    try {
      await removeImage(supabaseClient, userId, imagePath);
    } catch (err) {
      console.log(err);
    }
  }
};
const removeImage = async (
  supabaseClient: SupabaseClient,
  path: string,
  imagePath: string
) => {
  await supabaseClient.storage.from(path).remove([imagePath]);
};
