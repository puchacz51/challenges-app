import { nanoid } from '@reduxjs/toolkit';
import {
  useMutation,
  useQueryClient,
} from 'react-query';
import { supabase } from '../../services/supabase/supabase';
import { FormChallenge } from '../forms/AddChellenge';
import { ChallengeStepsForm } from '../forms/ChallengeSteps';
import axios from 'axios';
import { Challenge } from '../../types/challengeTypes';
import { AddChallenge } from '../../types/challengeFormTypes';


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
    await supabase
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
const addToDB = async (formData: AddChallenge) => {
  try {
    const { error, data } = await supabase
      .from('challenges')
      .insert(formData)
      .select();
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
  const {
    challengeSteps,
    images,
    userId,
    imagesOrder,
    challengStepOrder,
    ...rest
  } = values;
  let challengeRes: Challenge;
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
    challengeRes = await addToDB(dbData);
    let steps = [];
    if (Object.keys(challengeSteps).length) {
      steps = await addSteps(challengeSteps, challengeRes.id);
    }
    return { ...challengeRes, steps };
  } catch (err) {
    await Promise.allSettled([
      deleteFromDB(challengeRes.id),
      deleteImages(imagesPath),
      deleteSteps(challengeRes.id),
    ]);

    console.log(err);
  }
};

const getUrlFromFileList = (files: FileList) => {
  const result = ['local', URL.createObjectURL(files[0])];
  return result;
};
export const addChallengeMutation = (resetForm: Function) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => await addChallenge(values),
    onMutate: async (values: FormChallenge) => {
      const { userId, images, challengeSteps } = values;
      let challengeStepsArray;
      if (challengeSteps) {
        challengeStepsArray = Object.keys(challengeSteps).map(
          (key) => challengeSteps[key]
        );
      }
      const localImagesUrl = getUrlFromFileList(images);
      await queryClient.cancelQueries([userId]);
      const optimisticChallenge = {
        id: nanoid(),
        ...values,
        images: localImagesUrl,
        challengeSteps: challengeStepsArray,
        createdAt: Date.now().toLocaleString(),
        status: 'ACTIVE',
      } as Challenge;
      queryClient.setQueryData<Challenge[]>(
        [[userId, 'myChallenges']],
        (old) => {
          return [optimisticChallenge, ...old];
        }
      );

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

const sendChallengeFormData = (challengeObj: FormChallenge) => {
  try {
    axios.post('/challenge');
    const challengeFormData = new FormData();
    challengeFormData.append('title', challengeObj.title);
    challengeFormData.append('description', challengeObj.description);
    challengeFormData.append(
      'challengeSteps',
      JSON.stringify(challengeObj.challengeSteps)
    );
    challengeFormData.append('isPublic', challengeObj.isPublic);
  } catch (err) {}
};

export const addChallengeMutation2 = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => await addChallenge(values),
    onMutate: async (values: FormChallenge) => {
      const { userId, images, challengeSteps } = values;
      let challengeStepsArray;
      if (challengeSteps) {
        challengeStepsArray = Object.keys(challengeSteps).map(
          (key) => challengeSteps[key]
        );
      }
      const localImagesUrl = getUrlFromFileList(images);
      await queryClient.cancelQueries([userId]);
      const optimisticChallenge = {
        id: nanoid(),
        ...values,
        images: localImagesUrl,
        challengeSteps: challengeStepsArray,
        createdAt: Date.now().toLocaleString(),
        status: 'ACTIVE',
      } as Challenge;
      queryClient.setQueryData<Challenge[]>(
        [[userId, 'myChallenges']],
        (old) => {
          return [optimisticChallenge, ...old];
        }
      );

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
    },
  });
};
