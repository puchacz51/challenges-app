import { nanoid } from '@reduxjs/toolkit';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';
import { Challenge } from '../../pages/challenge/useChallengeQuery';
import { supabase } from '../../services/supabase/supabase';
import { FormChallenge } from '../forms/AddChellenge';
import {
  ChallengeStepForm,
  ChallengeSteps,
  ChallengeStepsForm,
} from '../forms/ChallengeSteps';

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
    console.log(err);

    throw err;
  }
};

const addSteps = async (steps: ChallengeStepsForm, challengeId: string) => {
  console.log(steps);

  try {
    const stepArray = Object.keys(steps).map((stepKey, index) => ({
      ...steps[stepKey],
      stepId: index,
      challengeId,
    }));

    const addAllSteps = await supabase.from('challengeSteps').insert(stepArray);
    return addAllSteps.body;
  } catch {
    throw new Error('can not add challenge steps ');
  }
};

const addToDB = async (formData) => {
  try {
    console.log(987, formData);

    const result = await supabase
      .from<Challenge>('challenges')
      .insert(formData);

    return result.data[0];
  } catch (err) {
    throw err;
  }
};

const deleteImages = async (imagesPath: string[]) => {
  try {
    const res = await supabase.storage.from('challenges').remove(imagesPath);
  } catch (e) {
    console.log(e);
  }
};
const addChallenge = async (values: FormChallenge) => {
  let imagesPath: string[];
  try {
    const { challengeSteps, images, userId, ...rest } = values;
    imagesPath = Array.from(images).map((image) => {
      const name = nanoid() + '.' + image.type.split('/')[1];
      const path = `${userId}/${name}`;
      return path;
    });

    await uploadImage(images, imagesPath);
    const dbData = { ...rest, userId, images: imagesPath };
    const challengeres = await addToDB(dbData);
    let steps;
    if (steps) {
      steps = await addSteps(challengeSteps, challengeres.id);
    }
    return { ...challengeres, steps };
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
        old.filter((challenge) => challenge.id === context.optimisticChallenge.id)
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
