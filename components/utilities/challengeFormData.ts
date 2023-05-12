import { UniqueIdentifier } from '@dnd-kit/core';
import {
  ChallengeStepsForm,
  FormChallenge,
} from '../../types/challengeFormTypes';

export const createChallengeFormData = (challengeData: FormChallenge) => {
  const challengeFormData = new FormData();
  const {
    category,
    description,
    challengStepOrder,
    images,
    imagesOrder,
    isPublic,
    title,
    userId,
    challengeSteps,
    endTime,
    startTime,
  } = challengeData;
  challengeFormData.append('title', title);
  challengeFormData.append('description', description);
  challengeFormData.append('category', category);
  challengeFormData.append('userId', userId);
  challengeFormData.append('isPublic', isPublic + '');
  challengeFormData.append('imageOrder', JSON.stringify(imagesOrder));
  challengeFormData.append('startTime', endTime);
  challengeFormData.append('endTime', startTime);

  const imagesArray = Array.from(images);
  imagesArray.forEach((image) => {
    challengeFormData.append('images[]', image);
  });

  if (challengeSteps && Object.keys(challengeSteps).length) {
    const orderedChallengeSteps = challengStepOrder.map((stepId) => {
      return challengeSteps[stepId];
    });

    challengeFormData.append(
      'challengeSteps',
      JSON.stringify(orderedChallengeSteps)
    );
  }
  return challengeFormData;
};
