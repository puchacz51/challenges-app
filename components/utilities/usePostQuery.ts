import { nanoid } from '@reduxjs/toolkit';
import { useQuery, UseQueryOptions } from 'react-query';
import { supabase } from '../../services/supabase/supabase';

const uploadImage = async (images: FileList, imagesPath: Array<string>) => {
  try {
    let index = 0;
    for (const image of images) {
      console.log(imagesPath[index++]);

      await supabase.storage
        .from('challeges')
        .upload(imagesPath[index++], image as File, {
          cacheControl: '3600',
          upsert: false,
        });
    }
  } catch (err) {
    throw err;
  }
};
const addToDB = async (formData) => {
  try {
    await supabase.from('challenges').insert(formData);
  } catch (err) {
    throw err;
  }
};

const deleteImages = async (imagesPath: string[]) => {
  try {
    await supabase.storage.from('challenges').remove(imagesPath);
  } catch (e) {
    console.log(e);
    throw e;
  }
};
const addChallenge = async (values: challenge, userId: string) => {
  let imagesPath;
  try {
    const { images, ...formValues } = values;
    imagesPath = Array.from(images).map((image) => {
      const name = nanoid() + '.' + image.type.split('/')[1];
      const path = `${userId}/${name}`;

      return path;
    });
    await uploadImage(images, imagesPath);
    const dbData = { ...formValues, images: imagesPath, userId };
    await addToDB(dbData);
  } catch (err) {
    deleteImages(imagesPath);
    console.log(err);
    throw err;
  }
};

const fetchChallenges = async (userId) => {
  try {
    const result = await supabase
      .from('challenges')
      .select('*')
      .eq('userId', userId);
    return result.data;
  } catch (error) {
    throw error;
  }
};
export const useChallengeQuery = (id, options?: UseQueryOptions) => {
  return useQuery(['myChallenges'], () => fetchChallenges(user?.id));
};
