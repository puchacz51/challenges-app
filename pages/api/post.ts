import { nanoid } from '@reduxjs/toolkit';
import { error } from 'console';
import formidable from 'formidable';
import next, { NextApiHandler, NextApiRequest } from 'next';
import { useId } from 'react';
import { privateChellengeschema } from '../../components/forms/validateChallenge';
import { supabase } from '../../services/supabase/supabase';
export const config = {
  api: {
    bodyParser: false,
  },
};
const handler: NextApiHandler = async (req, res) => {
  const user = await supabase.auth.api.getUserByCookie(req);
  console.log(supabase.storage.headers);
    
  if (!user) {
    res.status(500).json('no user');
  }
  try {
    const result = await challengeFormParser(req);
    UploadImages(user, result.images);
    res.status(200).json('ddassaddsa');
  } catch (err) {
    res.status(500).json(error);
  }
};

const UploadImages = async (user, files) => {
  const photoId = nanoid();
  try {
    const data = await supabase.storage
      .from(`challenges`)
      .upload(`${user.id}/${photoId}`, files[0]);
    console.log(data);
  } catch (err) {
    throw err;
  }
};

const challengeFormParser = async (req: NextApiRequest) =>
  await new Promise(async (resolve, reject) => {
    try {
      const form = formidable();
      form.parse(req, async (err, fields, files) => {
        if (err) throw err;
        const userChallenge = { ...fields, images: files };

        await privateChellengeschema.validate(userChallenge);
        resolve(userChallenge);
      });
    } catch (err) {
      reject(err);
    }
  });

export default handler;
