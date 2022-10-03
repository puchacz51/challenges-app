import Image from 'next/image';
import { ChangeEvent, useState } from 'react';

const ImagesInput = (
  e: ChangeEvent<HTMLInputElement>,
  formHandler,
  setUrls
) => {
  const { files } = e.currentTarget;
  if (!files.length) return;
  const filesUrl = Array.from(files).map((file) => URL.createObjectURL(file));
  setUrls(filesUrl);
  formHandler(files);
};

const ImagesUplouder = ({ formik }) => {
  const [localImagesUrl, setLocalImagesUrl] = useState(['']);

  return (
    <>
      <label htmlFor='image'>add image</label>
      <input
        type='file'
        accept='images/png, images/jpeg'
        multiple={true}
        onChange={(e) =>
          HandleImages(
            e,
            (value) => formik.setFieldValue('images', value),
            setLocalImagesUrl
          )
        }
        name='images'
      />
      {localImagesUrl.map((imageUrl) => (
        <Image width='100' height='100' key={imageUrl} src={imageUrl} />
      ))}
    </>
  );
};
export default ImagesInput;
