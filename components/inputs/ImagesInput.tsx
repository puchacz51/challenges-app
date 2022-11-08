import Image from 'next/image';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FcAddImage } from 'react-icons/fc';
const CreateHandleImages =
  (setFiles, setUrls) => (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e?.currentTarget;
    if (!files.length) return;
    const filesUrl = Array.from(files).map((file) => URL.createObjectURL(file));
    setUrls(filesUrl);
    setFiles(files);
  };

const AddImagesElement = ({ addImages }) => {
  return (
    <label
      htmlFor='image'
      className='relative w-[48%] h-[100px] border-4  border-black '>
      <button
        onClick={addImages}
        className='w-full h-full flex justify-center items-center'>
        <FcAddImage className='w-4/5 h-4/5' />
      </button>
    </label>
  );
};
const ImagesUplouder = ({ errors }) => {
  const [localImagesUrl, setLocalImagesUrl] = useState([]);
  const { current: imageFiles } = useRef<File[]>([]);
  const { setValue } = useFormContext();
  const imageInputRef = useRef<HTMLInputElement>();
  const handleImageInput = () => {
    const newInputValue = imageInputRef.current.files;
    console.log(newInputValue);
    
    imageFiles.push(...newInputValue);
    console.log(imageFiles);
    
    const imageURLs = Array.from(imageFiles).map((file) =>
      URL.createObjectURL(file)
    );
    setLocalImagesUrl(imageURLs);
  };
  useEffect(() => {
    setValue('images', localImagesUrl);
  }, localImagesUrl);
  // const handleImages = CreateHandleImages(
  //   (v) => setValue('images', v),
  //   setLocalImagesUrl
  // );

  return (
    <>
      <input
        ref={imageInputRef}
        type='file'
        accept='images/png, images/jpeg'
        multiple={true}
        name='images'
        onChange={handleImageInput}
        className='hidden'
      />
      <span>{errors?.message}</span>
      <div className='flex w-full flex-wrap flex-row gap-y-2 justify-around'>
        <ImageItemsList imagesUrl={localImagesUrl} />

        <AddImagesElement addImages={() => imageInputRef.current.click()} />
      </div>
    </>
  );
};

const ImageItemsList = ({ imagesUrl }) => {
  return (
    <>
      {imagesUrl.map((imageUrl) => (
        <ImageItem key={imageUrl} imageUrl={imageUrl} />
      ))}
    </>
  );
};

const ImageItem = ({ imageUrl }) => {
  return (
    <div className='relative w-[48%] h-[100px] border-4  border-fuchsia-600 '>
      <Image
        alt='your image'
        layout='fill'
        objectFit='cover'
        key={imageUrl}
        src={imageUrl}
      />
    </div>
  );
};

export default ImagesUplouder;
