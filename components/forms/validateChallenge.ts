import { string, object, boolean, array, mixed } from 'yup';
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
      console.log(file.type);

      valided = false;
      return;
    }
  });
  return valided;
};
export const privateChellengeschema = object({
  title: string().required().max(30),
  description: string().required().max(200),
  images: mixed()
    .required('you need to provide at least a one image')
    .test('fileSize', 'image must be smaller than 5MB', validateSize)
    .test('fileType', 'unsupported image type', validateType),
});