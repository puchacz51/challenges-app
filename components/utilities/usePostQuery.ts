import { nanoid } from '@reduxjs/toolkit';
import { url } from 'inspector';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';
import { supabase } from '../../services/supabase/supabase';

const uploadImage = async (images: FileList, imagesPath: Array<string>) => {
  let index = 0;
  try {
    for (const image of images) {
      const res = await supabase.storage
        .from('challenges')
        .upload(imagesPath[index++], image as File, {
          cacheControl: '3600',
          upsert: false,
        });
      if (res.error) throw res.error;
    }
  } catch (err) {
    throw err;
  }
};
const addToDB = async (formData) => {
  try {
    const result = await supabase.from('challenges').insert(formData);
    return result.data[0];
  } catch (err) {
    throw err;
  }
};

const deleteImages = async (imagesPath: string[]) => {
  try {
    const res = await supabase.storage.from('challenges').remove(imagesPath);
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};
const addChallenge = async (values: Challenge) => {
  let imagesPath;
  try {
    const { images, userId, ...formValues } = values;
    imagesPath = Array.from(images).map((image) => {
      const name = nanoid() + '.' + image.type.split('/')[1];
      const path = `${userId}/${name}`;

      return path;
    });
    await uploadImage(images, imagesPath);
    const dbData = { ...formValues, images: imagesPath, userId };
    return await addToDB(dbData);
  } catch (err) {
    deleteImages(imagesPath);
    throw err;
  }
};

const fetchChallenges = async (userId) => {
  try {
    const result = await supabase
      .from('challenges')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });
    return result.data;
  } catch (error) {
    throw error;
  }
};
export const useChallengeQuery = (id, options?: UseQueryOptions) => {
  return useQuery([id], () => fetchChallenges(id));
};

const getUrlFromFileList = (files: FileList) => {
  return Array.from(files).map((file) => URL.createObjectURL(file));
};
export const addChallengeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => await addChallenge(values),
    onMutate: async (values) => {
      const { userId, images } = values;

      const localImagesUrl = getUrlFromFileList(images);
      await queryClient.cancelQueries([userId]);
      const optimisticChallenge = {
        id: nanoid(),
        ...values,
        images: localImagesUrl,
      };
      queryClient.setQueryData([userId], (old) => {
        return [optimisticChallenge, ...old];
      });

      return { optimisticChallenge };
    },
    onError: (err, values, context) => {
      const { userId } = values;
      queryClient.setQueryData([userId], (old) =>
        old.filter((challenge) => challenge.id === context.id)
      );
    },
    onSuccess: (data, variables, context) => {
      const { userId } = variables;

      queryClient.setQueryData([userId], (old) =>
        old.map((challege) =>
          challege.id === context.optimisticChallenge.id ? data : challege
        )
      );
    },
  });
};
