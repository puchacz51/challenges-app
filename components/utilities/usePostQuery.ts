import { nanoid } from '@reduxjs/toolkit';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';
import { Challenge } from '../../pages/challenge/useChallengeQuery';
import { supabase } from '../../services/supabase/supabase';
import { FormChallenge } from '../forms/AddChellenge';
import { ChallengeStepsForm } from '../forms/ChallengeSteps';

const uploadImage = async (images: FileList, imagesPath: Array<string>) => {
  try {
    const imagePromises = Array.from(images).map((image, i) =>
      supabase.storage
        .from('challenges')
        .upload(imagesPath[i++], image as File, {
          cacheControl: '3600',
          upsert: false,
        })
    );
    Promise.all(imagePromises);
  } catch (err) {
    throw err;
  }
};
const deleteSteps = async (challengeId: string) => async () => {
  try {
    const result = await supabase
      .from('challengeSteps')
      .delete()
      .eq('challengeId', challengeId);
  } catch {
    console.log('can not add challenge steps ');
  }
};
const addSteps = async (steps: ChallengeStepsForm, challengeId: string) => {
  try {
    const stepArray = Object.keys(steps).map((stepKey, index) => ({
      ...steps[stepKey],
      stepId: index,
      challengeId,
    }));

    const { data, error } = await supabase
      .from('challengeSteps')
      .insert(stepArray);
    if (error) throw error;
    return data;
  } catch {
    throw new Error('can not add challenge steps ');
  }
};
const deleteFromDB = async (challengeId: string) => {
  {
    return async () => {
      try {
        console.log('deleting from database');

        await supabase.from('challenges').delete().eq('id', challengeId);
      } catch (err) {
        console.log(err);
      }
    };
  }
};
const addToDB = async (formData: Challenge) => {
  try {
    const { error, data } = await supabase
      .from<Challenge>('challenges')
      .insert(formData);
    if (error) throw error;

    return data[0];
  } catch (err) {
    throw err;
  }
};
const deleteImages = async (imagesPath: string[]) => async () => {
  try {
    const res = await supabase.storage.from('challenges').remove(imagesPath);
  } catch (e) {
    console.log(e);
  }
};
const addChallenge = async (values: FormChallenge) => {
  let imagesPath: string[];
  const { challengeSteps, images, userId, imagesOrder, ...rest } = values;
  let challengeres: Challenge;
  try {
    imagesPath = Array.from(images).map((image) => {
      const name = nanoid() + '.' + image.type.split('/')[1];
      const path = `${userId}/${name}`;
      return path;
    });
    const orderedPaths = imagesOrder.map(({ name }) => {
      const foundedIndex = Array.from(images).findIndex(
        (item) => item.name === name
      );
      return imagesPath[foundedIndex];
    });

    await uploadImage(images, imagesPath);
    const dbData = { ...rest, userId, images: orderedPaths };
    challengeres = await addToDB(dbData);
    let steps = [];
    if (Object.keys(challengeSteps).length) {
      steps = await addSteps(challengeSteps, challengeres.id);
    }
    return { ...challengeres, steps };
  } catch (err) {
    await Promise.allSettled([
      deleteFromDB(challengeres.id),
      deleteImages(imagesPath),
      deleteSteps(challengeres.id),
    ]);

    console.log(err);
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
export const useChallengeQuery = (id: number, options?: UseQueryOptions) => {
  return useQuery(['challenge', id], () => fetchChallenges(id));
};

const getUrlFromFileList = (files: FileList) => {
  const result = ['local', URL.createObjectURL(files[0])];
  return result;
};
export const addChallengeMutation = (resetForm: Function) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const queryClient = useQueryClient();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMutation({
    mutationFn: async (values) => await addChallenge(values),
    onMutate: async (values: FormChallenge) => {
      const { userId, images } = values;

      const localImagesUrl = getUrlFromFileList(images);

      await queryClient.cancelQueries([userId]);
      const optimisticChallenge = {
        id: nanoid(),
        ...values,
        images: localImagesUrl,
      };
      queryClient.setQueryData([userId], () => {
        return [optimisticChallenge];
      });

      return { optimisticChallenge };
    },
    onError: (err, values, context) => {
      const { userId } = values;
      queryClient.setQueryData<Challenge[]>([userId], (old) =>
        old.filter(
          (challenge) => challenge.id === context.optimisticChallenge.id
        )
      );
    },
    onSuccess: (data, variables, context) => {
      const { userId } = variables;

      queryClient.setQueryData<Challenge[]>([userId], (old) =>
        old.map((challege) =>
          challege.id === context.optimisticChallenge.id ? data : challege
        )
      );
      resetForm();
    },
  });
};
