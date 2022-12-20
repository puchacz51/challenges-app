import { useDroppable } from '@dnd-kit/core';
import Image from 'next/image';
import { BsFillTrashFill } from 'react-icons/bs';

export const ImageItem = ({ imageUrl, removeImage, name }) => {
const {setNodeRef} = useDroppable({ id: name });
  return (
    <>
      <div className={`relative w-[47%] h-[100px] border-4  border-black `}>
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
