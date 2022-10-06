import { nanoid } from '@reduxjs/toolkit';
import axios from 'axios';
import { error } from 'console';
import formidable from 'formidable';
import next, { NextApiHandler, NextApiRequest } from 'next';
import { privateChellengeschema } from '../../components/forms/validateChallenge';
import { supabase } from '../../services/supabase/supabase';
import FormData from 'form-data';
export const config = {
  api: {
    bodyParser: false,
  },
};
const handler: NextApiHandler = async (req, res) => {
  const user = await supabase.auth.api.getUserByCookie(req);
  console.log(user.data.id);

  if (!user.data) {
    res.status(500).json('no user');
  }
  try {
    const result = await challengeFormParser(req);
    await UploadImages(user, result.images);
    res.status(200).json('ddassaddsa');
  } catch (err) {
    res.status(500).json(error);
  }
};

const UploadImages = async (user, files: {}) => {
  try {
    const bucketPath = `challenges/${user.data.id}/`;
    const header = supabase.storage.headers;
    let storagePath = supabase.storage.url;

    const sendImages = Object.keys(files).map((file) => {
      const ext = files[file].mimetype.split('/')[1];
      const formData = new FormData();
      const blobFile = new Blob()
      const photoId = nanoid();

      const imagePath = bucketPath + photoId + '.' + ext;
      storagePath = storagePath + '/' + imagePath;
      console.log(storagePath);
      formData.append('dsd', files[file], imagePath);

      formData.append('cacheControl', 3600);
      return uploadImage(storagePath, formData, header);
    });
    await Promise.all(sendImages);
  } catch (err) {
    console.log(err);

    throw err;
  }
};

const uploadImage = async (path: string, image: FormData, header) =>
  new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.post(path, image, { headers: header });
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });

const challengeFormParser = async (req: NextApiRequest) =>
  await new Promise(async (resolve, reject) => {
    try {
      const form = formidable({ keepExtensions: true });
      form.parse(req, async (err, fields, files) => {
        if (err) throw err;
        const userChallenge = { ...fields, images: files };
        console.log(files.image0.type);
        
        await privateChellengeschema.validate(userChallenge);
        resolve(userChallenge);
      });
    } catch (err) {
      reject(err);
    }
  });
export default handler;
