import { useDraggable, useDroppable } from '@dnd-kit/core';
import Image from 'next/image';
import { BsFillTrashFill } from 'react-icons/bs';
import { CSS } from '@dnd-kit/utilities';
export const ImageItem = ({ imageUrl, removeImage, name }) => {
  const { setNodeRef, transform, isDragging, listeners, attributes } =
    useDraggable({ id: name });
  const style = {
    transform: CSS.Translate.toString(transform),
  };
  console.log(imageUrl, isDragging);

  return (
    <>
      <div
        {...listeners}
        {...attributes}
        ref={setNodeRef}
        style={style}
        className={`relative w-[100%] h-[100px] border-4  border-black ${isDragging&&'z-30'}`}>
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
    </>
  );
};
