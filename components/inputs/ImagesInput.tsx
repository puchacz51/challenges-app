import Image from 'next/image';
import { ChangeEvent, useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const CreateHandleImages =
  (formHandler, setUrls) => (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e?.currentTarget;
    if (!files.length) return;
    const filesUrl = Array.from(files).map((file) => URL.createObjectURL(file));
    setUrls(filesUrl);
    formHandler(files);
  };
const ImagesUplouder = ({ errors }) => {
  const [localImagesUrl, setLocalImagesUrl] = useState(['']);
  const { setValue } = useFormContext();

  const handleImages = CreateHandleImages(
    (v) => setValue('images', v),
    setLocalImagesUrl
  );

  return (
    <>
      <label htmlFor='image'>add image</label>
      <input
        type='file'
        accept='images/png, images/jpeg'
        multiple={true}
        name='images'
        onChange={handleImages}
      />
      <span>{errors?.message}</span>

      <ImageItemsList imagesUrl={localImagesUrl} />
    </>
  );
};

const ImageItemsList = ({ imagesUrl }) => {
  // const placeholder

  return (
    <div className='flex flex-wrap gap-y-2 justify-around'>
      {imagesUrl.map((imageUrl) => (
        <ImageItem key={imageUrl} imageUrl={imageUrl} />
      ))}
    </div>
  );
};

const ImageItem = ({ imageUrl }) => {
  return (
    <div className='relative w-[48%] h-[100px] border-4  border-fuchsia-600 '>
      <Image layout='fill' objectFit='cover' key={imageUrl} src={imageUrl} />
    </div>
  );
};

export default ImagesUplouder;
