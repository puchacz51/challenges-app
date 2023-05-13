import {
  ChallengeStepsForm,
  FormChallenge,
} from '../../types/challengeFormTypes';
import { ChallengeStepInsert } from '../../types/challengeTypes';

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
  // challengeFormData.append('imageOrder', JSON.stringify(imagesOrder));
  challengeFormData.append('startTime', endTime);
  challengeFormData.append('endTime', startTime);

  const imagesArray = Array.from(images);
  imagesArray.forEach((image) => {
    challengeFormData.append('images[]', image);
  });

  if (challengeSteps && Object.keys(challengeSteps).length) {
    const orderedChallengeSteps = challengStepOrder.map((stepIndex, i) => {
      const { time, title, completed, description } = challengeSteps[stepIndex];
      return {
        challengeId: null,
        completed,
        description,
        stepId: i,
        time,
        title,
      } as ChallengeStepInsert;
    });

    challengeFormData.append(
      'challengeSteps',
      JSON.stringify(orderedChallengeSteps)
    );
  }
  return challengeFormData;
};
