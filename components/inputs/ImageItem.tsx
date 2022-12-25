import { useDraggable, useDroppable } from '@dnd-kit/core';
import Image from 'next/image';
import { BsFillTrashFill } from 'react-icons/bs';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
export const ImageItem = ({ imageUrl, removeImage, name }) => {
  const { setNodeRef, transform, isDragging, listeners, attributes } =
    useSortable({ id: name });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        className={`relative w-[100%] h-[100px] border-4  border-black z-10 `}>
        <Image
          alt='your image'
          layout='fill'
          objectFit='cover'
          key={imageUrl}
          src={imageUrl}
        />
        <button
          type='button'
          className='absolute right-0 z-20  '
          onClick={() => removeImage(name)}>
          <BsFillTrashFill className='h-10 w-10 right-0 p-1 bg-slate-500 text-white rounded-2xl translate-x-5 -translate-y-5 ' />
        </button>
      </div>
    </>
  );
};
