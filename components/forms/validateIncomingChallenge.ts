import {
  string,
  object,
  boolean,
  array,
  mixed,
  date,
  lazy,
  number,
  ref,
} from 'yup';
import { CHALLENGECATEGORIES } from '../../types/challengeTypes';

const validateTime = date()
  .min(new Date(), 'Date cannot be earlier than current time')
  .max(
    new Date(new Date().getFullYear() + 20, 11, 31),
    'Date must be within 20 years from now'
  );

export const validateSize = (files: FileList) => {
  if (!files) {
    return false;
  }
  let valided = true;
  Array.from(files).forEach((file) => {
    if (file && file.size > 5000000) {
      valided = false;
      return;
    }
  });
  return valided;
};
export const validateType = (files: FileList) => {
  const supportedTypes = ['image/png', 'image/jpeg'];
  if (!files) {
    return false;
  }
  let valided = true;
  Array.from(files).forEach((file) => {
    if (file && !supportedTypes.includes(file.type)) {
      valided = false;
      return;
    }
  });
  return valided;
};
const challengeStepsSchema = lazy((value) => {
  if (value) {
    const stepObject = object({
      title: string().required('title is required in step').max(30),
      description: string().required('description is required').max(100),
      time: validateTime.notRequired().nullable(),
    });

    const newEntries = Object.keys(value).reduce((acc, val) => {
      return {
        ...acc,
        [val]: stepObject,
      };
    }, {});
    return object().shape(newEntries);
  }
  return mixed().notRequired();
});

export const challengeSchema = object({
  title: string().required().max(30),
  description: string().required().max(200),
  category: string()
    .required()
    .oneOf(CHALLENGECATEGORIES as unknown as string[]),
  images: mixed()
    .required('you need to provide at least a one image')
    .test(
      'filesLength',
      'you need to provide at least a one image',
      (files) => files.length > 0
    )
    .test('fileSize', 'image must be smaller than 5MB', validateSize)
    .test('fileType', 'unsupported image type', validateType),
  challengeSteps: challengeStepsSchema,
});
export const incomingChallengeSchema = object({
  title: string().required().max(30),
  description: string().required().max(200),
  category: string()
    .required()
    .oneOf(CHALLENGECATEGORIES as unknown as string[]),
  images: mixed()
    .required('you need to provide at least a one image')
    .test(
      'filesLength',
      'you need to provide at least a one image',
      (files) => files && files.length > 0
    )
    .test('fileSize', 'image must be smaller than 5MB', validateSize)
    .test('fileType', 'unsupported image type', validateType),
  isPublic: boolean().required(),
  startTime: validateTime.required(),
  endTime: date()
    .notRequired()
    .min(ref('startTime'), 'end time must be geater then start time'),
});

export const incomingChallengeStepsSchema = array(
  object({
    title: string().required('title is required in step').max(30),
    description: string().required('description is required').max(100),
    time: date().notRequired().nullable(),
    stepId: number().min(0).max(4).required(),
  })
);
