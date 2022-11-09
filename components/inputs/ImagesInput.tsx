import Image from 'next/image';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FcAddImage, FcRemoveImage } from 'react-icons/fc';
import { BsFillTrashFill } from 'react-icons/bs';

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
      className='relative w-[44%] h-[100px] border-4  border-black '>
      <button
        onClick={addImages}
        className='w-full h-full flex justify-center items-center'>
        <FcAddImage className='w-4/5 h-4/5' />
      </button>
    </label>
  );
};
const ImagesUplouder = ({ errors }) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { setValue } = useFormContext();
  const imageInputRef = useRef<HTMLInputElement>();
  const handleImageInput = () => {
    const newInputValue = Array.from(imageInputRef.current.files);
    setImageFiles([...imageFiles, ...newInputValue]);
  };
  const removeImage = (name: string) => {
    console.log(name);
    
    const newImageFiles = imageFiles.filter(
      (file) => name !== file.name
    );
    setImageFiles(newImageFiles);
  };

  useEffect(() => {
    setValue('images', imageFiles);
  }, [setValue, imageFiles]);

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
      <div className='flex w-full flex-wrap flex-row gap-3 justify-between'>
        <ImageItemsList key={imageFiles.length}  imageFiles={imageFiles} removeImage={removeImage} />
        {imageFiles.length < 6 && (
          <AddImagesElement addImages={() => imageInputRef.current.click()} />
        )}
      </div>
    </>
  );
};

const ImageItemsList = ({ imageFiles,removeImage }:{imageFiles:File[],removeImage:Function}) => {
  const [localImagesUrl, setLocalImagesUrl] = useState([]);
  useEffect(() => {
    const imageURLs = imageFiles?.map((file) => URL.createObjectURL(file));
    setLocalImagesUrl(imageURLs)
  }, [imageFiles]);


  return (
    <>
      {localImagesUrl?.map((imageUrl, i) => (
        <ImageItem
          key={imageUrl}
          imageUrl={imageUrl}
          name={imageFiles[i].name}
          removeImage={removeImage}
        />
      ))}
    </>
  );
};

const ImageItem = ({ imageUrl,removeImage,name }) => {
  return (
    <div className='relative w-[47%] h-[100px] border-4  border-black '>
      <Image
        alt='your image'
        layout='fill'
        objectFit='cover'
        key={imageUrl}
        src={imageUrl}
      />
      <button className='absolute right-0   ' onClick={()=>removeImage(name)}>
        <BsFillTrashFill className='h-10 w-10 right-0 p-1 bg-slate-500 text-white rounded-2xl translate-x-5 -translate-y-5 ' />
      </button>
    </div>
  );
};

export default ImagesUplouder;
