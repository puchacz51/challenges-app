import { string, object, boolean, array, mixed, date, lazy } from 'yup';
export const validateSize = (files) => {
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
export const validateType = (files) => {
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
      time: date().notRequired(),
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

export const privateChellengeschema = object({
  title: string().required().max(30),
  description: string().required().max(200),
  images: mixed()
    .required('you need to provide at least a one image')
    .test('fileSize', 'image must be smaller than 5MB', validateSize)
    .test('fileType', 'unsupported image type', validateType),
  challengeSteps: challengeStepsSchema,
});
