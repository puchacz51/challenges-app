import { UniqueIdentifier } from '@dnd-kit/core';
import {
  ChallengeStepForm,
  FormChallenge,
} from '../../types/challengeFormTypes';
import { ChallengeWithSteps } from '../../types/challengeTypes';
type ChallengeToForm = (challenge: ChallengeWithSteps) => FormChallenge;
// export const challengeToForm: ChallengeToForm = (challenge) => {
//   const { challengeSteps, ...rest } = challenge;
//   const challengeStepsObject = new Object();
//   for (let { stepId, time, description, title } of challengeSteps) {
//     challengeStepsObject[stepId as UniqueIdentifier] = {
//       title,
//       time,
//       description,
//     };
//     const challengeStepOrder = challengeSteps.map(
//       (step) => step.stepId as UniqueIdentifier
//     );

//     return {
//       ...rest,
//       challengeSteps: challengeStepsObject as ChallengeStepForm,
//       challengeStepOrder,
//     };
//   }
// };
