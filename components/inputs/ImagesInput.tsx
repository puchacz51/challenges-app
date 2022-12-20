import Image from 'next/image';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FcAddImage, FcRemoveImage } from 'react-icons/fc';
import { DndContext } from '@dnd-kit/core';
import { ImageItem } from './ImageItem';
import { SortableContext } from '@dnd-kit/sortable';

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
        type='button'
        onClick={addImages}
        className='w-full h-full flex justify-center items-center'>
        <FcAddImage className='w-4/5 h-4/5' />
      </button>
    </label>
  );
};
const ImagesUplouder = ({ errors }) => {
  const [inputErors, setInputErrors] = useState([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { setValue } = useFormContext();
  const imageInputRef = useRef<HTMLInputElement>();
  const handleImageInput = () => {
    const newInputValue = Array.from(imageInputRef.current.files);
    if (newInputValue.length + imageFiles.length > 6) {
      setInputErrors(['max amount of images is 6']);
      return;
    }
    setInputErrors([]);

    setImageFiles([...imageFiles, ...newInputValue]);
  };
  const removeImage = (name: string) => {
    const newImageFiles = imageFiles.filter((file) => name !== file.name);
    setInputErrors([]);
    setImageFiles(newImageFiles);
  };

  useEffect(() => {
    setValue('images', imageFiles);
  }, [setValue, imageFiles]);

  return (
    <>
      <div
        className={`p-2 text-red-600 border-2 border-black mb-4 ${
          !inputErors.length && 'hidden'
        }`}>
        {inputErors.map((err) => (
          <p key={err.length}>{err}</p>
        ))}
      </div>
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
        <ImageItemsList
          key={imageFiles.length}
          imageFiles={imageFiles}
          removeImage={removeImage}
        />
        {imageFiles.length < 6 && (
          <AddImagesElement addImages={() => imageInputRef.current.click()} />
        )}
      </div>
    </>
  );
};

const ImageItemsList = ({
  imageFiles,
  removeImage,
}: {
  imageFiles: File[];
  removeImage: Function;
}) => {
  const [localImagesUrl, setLocalImagesUrl] = useState([]);
  useEffect(() => {
    const imageURLs = imageFiles?.map((file) => URL.createObjectURL(file));
    setLocalImagesUrl(imageURLs);
  }, [imageFiles]);

  return (
    <>
      <DndContext>
        <SortableContext items={localImagesUrl}>
          {localImagesUrl?.map((imageUrl, i) => (
            <ImageItem
              key={imageUrl}
              imageUrl={imageUrl}
              name={imageFiles[i].name}
              removeImage={removeImage}
            />
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
};

export default ImagesUplouder;
