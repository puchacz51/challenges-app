import { nanoid } from '@reduxjs/toolkit';
import axios from 'axios';
import formidable from 'formidable';
import next, { NextApiHandler, NextApiRequest } from 'next';
import FormData, { from } from 'form-data';
import {
  SupabaseClient,
  User,
  createServerSupabaseClient,
} from '@supabase/auth-helpers-nextjs';
import {
  Challenge,
  ChallengeCategory,
  ChallengeInsert,
} from '../../types/challengeTypes';
import { ChallengeStepForm, ImageOrder } from '../../types/challengeFormTypes';
import { randomUUID } from 'crypto';
import { Database } from '../../services/supabase/schema';
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
          imagesOrder: JSON.parse(fields.imageOrder as string) as ImageOrder,
          startTime: fields.startTime as string,
          endTime: fields.endTime as string,
        };
        const challengeSteps = fields.challengeSteps
          ? JSON.parse(fields.challengeSteps as string)
          : null;
      } catch (err) {
        res.end('sone error occurred');
      }

      res.end('Dane odebrane!');
    });
  }
};
export default handler;

const addChallenge = (user: User, images: FileList) => {
  try {
    UploadImages(images, supabaseClient, user);
  } catch (e) {}
};

const generateImagePath = (imagesArray: File[], userId: string) =>
  imagesArray.map((image) => {
    const imageId = randomUUID();
    const imageExtension = image.name.split('.').pop();
    const imagePath = `${imageId}.${imageExtension}`;
    return { name: imageId, path: imagePath, image };
  });

const UploadImages = async (
  images: FileList,
  supabaseClient: SupabaseClient<Database>,
  user: User
) => {
  try {
    const imageArray = Array.from(images);
    const imagesPaths = generateImagePath(imageArray, user.id);
    let imageUploadPromises: Promise<string>[] = [];
    let successedPaths: string[];

    for (let { image, name, path } of imagesPaths) {
      imageUploadPromises.push(
        uploadImage(supabaseClient, user.id, image, path).then((path) => {
          successedPaths.push(path);
          return path;
        })
      );
    }

    Promise.all(imageUploadPromises).catch((_err) => {
      removeImages(user.id, successedPaths);
    }).then;
  } catch (err) {
    throw new Error('   ');
  }
};

const addChallengeToDB = async (
  challengeData: ChallengeInsert,
  challengeSteps?: ChallengeStepForm[]
) => {
  try {
    await supabaseClient.from('challenges').insert(challengeData);
    if (challengeSteps) {
      supabaseClient.from('challenges').insert(challengeSteps);
    }
  } catch (err) {
    console.log(err, 'from add to db');
  }
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
