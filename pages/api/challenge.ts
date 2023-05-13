import formidable from 'formidable';
import next, { NextApiHandler, NextApiRequest } from 'next';
import {
  SupabaseClient,
  User,
  createServerSupabaseClient,
} from '@supabase/auth-helpers-nextjs';
import { ChallengeCategory, ChallengeInsert } from '../../types/challengeTypes';
import { ImageOrder } from '../../types/challengeFormTypes';
import { randomUUID } from 'crypto';
import { Database } from '../../services/supabase/schema';
import { UniqueIdentifier } from '@dnd-kit/core';
import { ChallengeStepsForm } from '../../types/challengeFormTypes';
import { ChallengeStepInsert } from '../../types/challengeTypes';
export const config = {
  api: {
    bodyParser: false,
  },
};

let supabaseClient: SupabaseClient<Database>;

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    supabaseClient = createServerSupabaseClient({ req, res });
    const {
      data: { session },
      error,
    } = await supabaseClient.auth.getSession();
    if (error || !session) {
      res.statusCode = 401;
      res.end('Unauthorized request');
    }
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end('some erro occurred');
        return;
      }
      try {
        const challengeData = {
          title: fields.title as string,
          description: fields.description as string,
          category: fields.category as ChallengeCategory,
          userId: fields.userId as string,
          isPublic: fields.isPublic === 'true',
          startTime: fields.startTime as string,
          endTime: fields.endTime as string,
        } as ChallengeInsert;
        const images = Array.isArray(files.images)
          ? files.images
          : [files.images];
        let challengeSteps: ChallengeStepInsert[] | null = null;
        if (fields.challengeSteps) {
          challengeSteps = JSON.parse(fields.challengeSteps as string);
        }
      } catch (err) {
        res.end('some error occurred');
      }

      res.end('Dane odebrane!');
    });
  }
};
export default handler;

const addChallenge = async (
  challengeData: ChallengeInsert,
  challengeSteps: ChallengeStepInsert[] | null,
  user: User,
  images: File[]
) => {
  let uploadedImagesPaths: string[];
  try {
    const {} = UploadImages(images, user);
  } catch (err) {}
};

const generateImagePath = (imagesArray: File[], userId: string) =>
  imagesArray.map((image) => {
    const imageId = randomUUID();
    const imageExtension = image.name.split('.').pop();
    const imagePath = `${imageId}.${imageExtension}`;
    return { name: imageId, path: imagePath, image };
  });

const UploadImages = async (images: File[], user: User) => {
  try {
    const imagesPaths = generateImagePath(images, user.id);
    let imageUploadPromises: Promise<string>[] = [];
    // let successedPaths: string[];

    for (let { image, name, path } of imagesPaths) {
      imageUploadPromises.push(
        uploadImage(supabaseClient, user.id, image, path)
      );
    }
    const imagesUploadData = await Promise.allSettled(imageUploadPromises);
    if (
      imagesUploadData.findIndex((imageRes) => imageRes.status === 'fulfilled')
    ) {
      const successedPaths = imagesUploadData
        .filter((imageRes) => imageRes.status !== 'fulfilled')

      await removeImages(user.id);
      return;
    }
  } catch (err) {
    throw new Error('   ');
  }
};

const addChallengeToDB = async (challengeData: ChallengeInsert) => {
  try {
    await supabaseClient.from('challenges').insert(challengeData);
  } catch (err) {
    throw err;
  }
};

const addChallengeStepsToDB = async (
  challengeStepsData: ChallengeStepsForm,
  challengeId: string,
  challengeStepsOrder: UniqueIdentifier[]
) => {
  const orderedSteps = challengeStepsOrder.map((challengeId, index) => {
    const challengeStep = challengeStepsData[challengeId];
    return {
      stepId: index,
      title: challengeStep.title,
      description: challengeStep.description,
      challengeId: challengeId,
      time: challengeStep.time ? challengeStep.time : null,
    } as ChallengeStepInsert;
  });

  supabaseClient.from('challengeSteps').insert(orderedSteps);
};

const uploadImage = (
  supabaseClient: SupabaseClient,
  bucket: string,
  image: File,
  imageName: string
) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const { data, error } = await supabaseClient.storage
        .from(bucket)
        .upload(imageName, image);
      if (error) {
        throw error;
      }
      resolve(data.path);
    } catch (error) {
      reject(error);
    }
  });
};

const removeImages = (userId: string, imagesPaths: string[]) => {
  for (let imagePath of imagesPaths) {
    try {
      removeImage(supabaseClient, userId, imagePath);
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
