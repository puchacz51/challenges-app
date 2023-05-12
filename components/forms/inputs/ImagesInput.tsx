import Image from 'next/image';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FcAddImage, FcRemoveImage } from 'react-icons/fc';
import {
  DndContext,
  DragMoveEvent,
  DragOverlay,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  UniqueIdentifier,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { ImageItem } from './ImageItem';
import { arrayMove } from '@dnd-kit/sortable';

const AddImagesElement = ({ addImages }) => {
  return (
    <label
      htmlFor='image'
      className='relative h-[100px] border-4  border-black '>
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
    if (newInputValue.length + imageFiles.length > 5) {
      setInputErrors(['max amount of images is 5']);
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
  const setImageOrader = (images) => {
    setValue('imagesOrder', images);
  };
  useEffect(() => {
    setValue('images', imageFiles);
  }, [setValue, imageFiles]);
  console.log(imageFiles);

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
      <ImageItemsList
        setImagesOrder={setImageOrader}
        imageFiles={imageFiles}
        removeImage={removeImage}
        addImage={() => imageInputRef.current.click()}
      />
    </>
  );
};
interface ImageItemsListProps {
  imageFiles: File[];
  removeImage: Function;
  addImage: Function;
  setImagesOrder?: (images) => void;
}
const ImageItemsList = ({
  imageFiles,
  removeImage,
  addImage,
  setImagesOrder,
}: ImageItemsListProps) => {
  const [localImages, setLocalImages] = useState<
    { name: string; url: string }[]
  >([]);

  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    const newLocalImage = imageFiles.map((image) => {
      const oldImage = localImages.find(
        (localImage) => localImage.name === image.name
      );
      if (oldImage) return oldImage;
      return { name: image.name, url: URL.createObjectURL(image) };
    });
    const sortedNewLocalImages = newLocalImage.sort((a, b) => {
      const indexA = localImages.findIndex(
        (oldImage) => oldImage.name == a.name
      );
      const indexB = localImages.findIndex(
        (oldImage) => oldImage.name == b.name
      );
      const valueA = indexA === -1 ? 10 : indexA;
      const valueB = indexB === -1 ? 10 : indexB;
      return valueA - valueB;
    });
    console.log(sortedNewLocalImages);
    
    setLocalImages(sortedNewLocalImages);
    setImagesOrder(sortedNewLocalImages);
  }, [imageFiles.length, imageFiles]);
  // drag
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { delay: 1, tolerance: 1 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 1, tolerance: 1 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);
  const { setNodeRef } = useDroppable({ id: 'imageArea' });
  const dragStartHandler = ({ active }) => {
    setActiveImage(active.id);
  };

  const dragEndhandler = useCallback(() => {
    setImagesOrder(localImages);
    setActiveImage(null);
  }, [localImages]);
  const dragMoveHandler = useCallback(
    ({ active, over, delta }: DragMoveEvent) => {
      if (active.id != over?.id) {
        setLocalImages((images) => {
          const imagesUrls = images.map(
            (image) => image.url
          ) as UniqueIdentifier[];
          const oldIndex = imagesUrls.indexOf(active.id);
          const newIndex = imagesUrls.indexOf(over?.id);
          return arrayMove(images, oldIndex, newIndex);
        });
      }
    },

    []
  );
  const cancelDragHandler = useCallback(() => {
    setActiveImage(null);
  }, []);
  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={dragStartHandler}
        onDragEnd={dragEndhandler}
        onDragOver={dragMoveHandler}
        onDragCancel={cancelDragHandler}
        autoScroll={false}
        collisionDetection={rectIntersection}>
        <div
          ref={setNodeRef}
          className='grid grid-cols-2 gap-4 gird w-full justify-between first '>
          {localImages?.map(({ url, name }, i) => (
            <ImageItem
              key={url}
              imageUrl={url}
              name={name}
              removeImage={removeImage}
            />
          ))}
          <DragOverlay>
            {activeImage && (
              <ImageItem
                name='dragged'
                removeImage={null}
                imageUrl={activeImage}
              />
            )}
          </DragOverlay>
          {imageFiles.length < 5 && <AddImagesElement addImages={addImage} />}
        </div>
      </DndContext>
    </>
  );
};

export default ImagesUplouder;
