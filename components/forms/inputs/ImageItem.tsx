import { useDraggable, useDroppable } from '@dnd-kit/core';
import Image from 'next/image';
import { BsFillTrashFill } from 'react-icons/bs';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
export const ImageItem = ({ imageUrl, removeImage, name }) => {
  const { setNodeRef, transform, isDragging, listeners, attributes } =
    useSortable({ id: imageUrl});
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={`relative w-[100%] h-auto border-4 border-black z-10 first:col-span-2 aspect-video ${
          isDragging && 'border-red-600 shadow-inner'
        } `}
        style={style}>
        <Image
          alt='your image'
          layout='fill'
          objectFit='cover'
          key={imageUrl}
          src={imageUrl}
        />
        {removeImage && (
          <button
            type='button'
            className='absolute right-1 z-30  '
            onClick={() => removeImage(name)}>
            <BsFillTrashFill className='h-10 w-10 right-0 p-1 bg-red-700 text-white rounded-2xl translate-x-5 -translate-y-5 ' />
          </button>
        )}
      </div>
    </>
  );
};
