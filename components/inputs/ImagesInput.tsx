import Image from 'next/image';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FcAddImage, FcRemoveImage } from 'react-icons/fc';
import { BsFillTrashFill } from 'react-icons/bs';
import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
    <DndProvider backend={HTML5Backend}>
      {localImagesUrl?.map((imageUrl, i) => (
        <ImageItem
          key={imageUrl}
          imageUrl={imageUrl}
          name={imageFiles[i].name}
          removeImage={removeImage}
        />
      ))}
    </DndProvider>
  );
};

const ImageItem = ({ imageUrl, removeImage, name }) => {
  const [{isDragging}, drag, prev] = useDrag(() => ({
    type: 'image',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
console.log(isDragging);

  if(isDragging){

return <div  className='hidden' ></div>
  }


  return (
    <div
      ref={drag}
      className={`relative w-[47%] h-[100px] border-4  border-black ${isDragging&&'hidden'}`}>
      <Image
        alt='your image'
        layout='fill'
        objectFit='cover'
        key={imageUrl}
        src={imageUrl}
      />
      <button
        type='button'
        className='absolute right-0   '
        onClick={() => removeImage(name)}>
        <BsFillTrashFill className='h-10 w-10 right-0 p-1 bg-slate-500 text-white rounded-2xl translate-x-5 -translate-y-5 ' />
      </button>
    </div>
  );
};

export default ImagesUplouder;
