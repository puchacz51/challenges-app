import { UniqueIdentifier } from '@dnd-kit/core';
import { ChallengeCategory } from './challengeTypes';

export type AddChallenge = {
  title: string;
  description: string;
  userId: string;
  isPublic: boolean;
  createdAt?: string;
  images: string[];
  endTime?: string;
  startTime?: string;
};

export type ChallengeStepForm = {
  title: string;
  description?: string;
  time: string;
  challengeId?: number;
  stepId?: number;
  completed?: boolean;
};
export type ChallengeStepsForm = {
  [key: UniqueIdentifier]: ChallengeStepForm;
};
export type ImageOrder = { name: string; url: string[] }[];

export interface FormChallenge {
  title: string;
  description: string;
  isPublic: boolean;
  startTime?: any;
  endTime?: any;
  images: FileList | null;
  challengeSteps?: ChallengeStepsForm | null;
  challengStepOrder: UniqueIdentifier[];
  userId: string;
  imagesOrder: ImageOrder | null;
  category: ChallengeCategory | null;
}
