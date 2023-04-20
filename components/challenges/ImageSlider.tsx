import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
interface ImageSliderProps {
  imagesUrl: string[];
}
interface TouchPosition {
  start: number;
  current: number;
  maxPosition: number;
  containerWidth: number;
  imageWidth: number;
}
const initialPositionData: TouchPosition = {
  start: 0,
  current: 0,
  maxPosition: 0,
  containerWidth: 0,
  imageWidth: 0,
};

const bucketPath = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/challenges/`;

const ImageSlider = ({ imagesUrl }: ImageSliderProps) => {
  const imageContianerRef = useRef<HTMLDivElement>();
  const touchPosition = useRef<TouchPosition>(initialPositionData);
  const [currentImage, setCurrentImage] = useState<number>(0);
  const handleStartTouch = (event: TouchEvent) => {
    const { current, imageWidth } = touchPosition.current;

    touchPosition.current.start =
      event.touches[0].clientX + currentImage * imageWidth;
  };
  const handleMovetouch = (event: TouchEvent) => {
    const shift = touchPosition.current.start - event.touches[0].clientX;
    touchPosition.current.current = shift;

    if (shift < 0) {
      touchPosition.current.current = touchPosition.current.start;
      return;
    }
    if (shift > touchPosition.current.maxPosition) {
      touchPosition.current.current = touchPosition.current.maxPosition;
      return;
    }
  };
  const handleEndTouch = (event: TouchEvent) => {
    const { current: currentPosition, imageWidth } = touchPosition.current;
    const nextImageIndex = Math.round(currentPosition / imageWidth);
    touchPosition.current = {
      ...touchPosition.current,
      start: imageWidth * nextImageIndex,
      current: imageWidth * nextImageIndex,
    };

    setCurrentImage(nextImageIndex);
  };

  useEffect(() => {
    const imageContainer = imageContianerRef.current;
    const imageContainerWidth = imageContainer.offsetWidth;
    touchPosition.current = {
      ...touchPosition.current,
      maxPosition: imageContainerWidth * (imagesUrl.length - 1),
      imageWidth: imageContainerWidth,
    };
  }, [imagesUrl.length, currentImage]);
  return (
    <div className='relative overflow-hidden border-4 border-black'>
      <motion.div
        ref={imageContianerRef}
        animate={{ x: -touchPosition.current.current }}
        onTouchStart={handleStartTouch as any}
        onTouchMove={handleMovetouch as any}
        onTouchEnd={handleEndTouch as any}
        className={` flex flex-nowrap  h-[200px] bg-slate-200  `}>
        {imagesUrl.map((url, index) => {
          return (
            <motion.div
              whileTap={{ scale: 1.05 }}
              key={url}
              className={`relative shrink-0 h-[200px] w-full`}>
              <Image
                layout='fill'
                objectFit='cover'
                alt='userPhoto'
                src={`${bucketPath}${url}`}
              />
            </motion.div>
          );
        })}
      </motion.div>
      <span className='absolute right-0 top-0 p-2 bg-slate-50 rounded-3xl text-lg opacity-50'>{`${
        currentImage + 1
      }/${imagesUrl.length}`}</span>
    </div>
  );
};

export default ImageSlider;
