import Image from 'next/image';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FcAddImage, FcRemoveImage } from 'react-icons/fc';
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { ImageItem } from './ImageItem';
import { arrayMove } from '@dnd-kit/sortable';

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
    console.log('removed ');

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
      <ImageItemsList
        key={imageFiles.length}
        imageFiles={imageFiles}
        removeImage={removeImage}
        addImage={() => imageInputRef.current.click()}
      />
    </>
  );
};

const ImageItemsList = ({
  imageFiles,
  removeImage,
  addImage,
}: {
  imageFiles: File[];
  removeImage: Function;
  addImage: Function;
}) => {
  const [localImagesUrl, setLocalImagesUrl] = useState([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    const imageURLs = imageFiles?.map((file) => URL.createObjectURL(file));
    setLocalImagesUrl(imageURLs);
  }, [imageFiles]);
  // drag
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 15 }
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { distance: 15 },onActivation:(e)=>e.event.preventDefault()
  });
  const sensors = useSensors(mouseSensor, touchSensor);
  const { setNodeRef } = useDroppable({ id: 'imageArea' });
  const dragStartHandler = ({ active }) => {
    console.log('start');

    setActiveImage(active.id);
  };

  const dragEndhandler = useCallback(
    ({ active, over, delta, activatorEvent }: DragEndEvent) => {
      if (active.id != over?.id) {
        setLocalImagesUrl((imageUrls) => {
          const oldIndex = imageUrls.indexOf(active.id);
          const newIndex = imageUrls.indexOf(over?.id);

          return arrayMove(imageUrls, oldIndex, newIndex);
        });
      }
      setActiveImage(null);
    },
    []
  );
  const dragMoveHandler = useCallback(
    ({ active, over, delta }: DragMoveEvent) => {
      if (Math.max(delta.x, delta.y) < 10) return;
      if (active.id != over?.id) {
        setLocalImagesUrl((imageUrls) => {
          const oldIndex = imageUrls.indexOf(active.id);
          const newIndex = imageUrls.indexOf(over?.id);

          return arrayMove(imageUrls, oldIndex, newIndex);
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
          {localImagesUrl?.map((imageUrl, i) => (
            <ImageItem
              key={imageUrl}
              imageUrl={imageUrl}
              name={imageFiles[i].name}
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
          {imageFiles.length < 6 && <AddImagesElement addImages={addImage} />}
        </div>
      </DndContext>
    </>
  );
};

export default ImagesUplouder;
