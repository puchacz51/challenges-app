import React, {
  useState,
  useEffect,
  useRef,
  ReactNode,
  ReactElement,
  SyntheticEvent,
  DragEvent,
} from 'react';
import Image from 'next/image';

interface SliderPostion {
  positionX: number;
  startPositionX: number;
  endPositionX: number;
  maxPositionX: number;
  childrenLength: number;
  childrenWidth: number;
}

const InitialStateSliderPosition = {
  positionX: 0,
  startPositionX: 0,
  endPositionX: 0,
  maxPositionX: 0,
  childrenLength: 0,
  childrenWidth: 0,
};

const handleResize = (
  imageContainerRef: { current: HTMLDivElement },
  sliderPosition: SliderPostion
) => {
  const { current: slider } = imageContainerRef;
  const image = imageContainerRef.current.children[0];
  sliderPosition.childrenWidth = image.offsetWidth;
  sliderPosition.maxPositionX =
    -slider.offsetWidth * (sliderPosition.childrenLength + 1);
};
const smoothSlideToPhoto = (
  sliderPosistion: SliderPostion,
  imagesContainerRef: HTMLElement,
  startPosition: number
) => {
  const destination = sliderPosistion.endPositionX;
  const trace = sliderPosistion.endPositionX - startPosition;
  const step = trace / 50;
  const idInterval = setInterval(() => {
    sliderPosistion.endPositionX = sliderPosistion.endPositionX + step;
   }, 10);
};
const transfromX = (
  shift: Number,
  sliderPosition: SliderPostion,
  slider: HTMLDivElement
) => {
  if (shift < sliderPosition.maxPositionX) {
    slider.style.transform = `translateX(${sliderPosition.maxPositionX}px)`;
    sliderPosition.endPositionX = sliderPosition.maxPositionX;
    return;
  }
  if (shift > 0) {
    slider.style.transform = `translateX(${0}px)`;
    sliderPosition.endPositionX = 0;
    return;
  }
  slider.style.transform = `translateX(${shift}px)`;
};

const ImageSlider = ({ imagesUrl, className = '' }): ReactElement<string[]> => {
  const [imageNumber, setImageNumber] = useState(1);
  const sliderRef = useRef<HTMLDivElement>();
  const imagesContainerRef = useRef<HTMLDivElement>();
  const { current: sliderPosition } = useRef<SliderPostion>(
    InitialStateSliderPosition
  );
  sliderPosition.childrenLength = imagesUrl.length;
  useEffect(() => {
    handleResize(imagesContainerRef, sliderPosition);
    addEventListener('resize', () =>
      handleResize(imagesContainerRef, sliderPosition)
    );

    return () =>
      removeEventListener('resize', () =>
        handleResize(imagesContainerRef, sliderPosition)
      );
  }, []);

  const touchHandler = (e: SyntheticEvent<HTMLDivElement, TouchEvent>) => {
    const currentX = e?.touches[0].clientX;
    const startX = sliderPosition.startPositionX;
    const endX = sliderPosition.endPositionX;
    const x = -1 * (startX - currentX) + endX;
    transfromX(x, sliderPosition, imagesContainerRef.current);
  };
  const touchStartHandler = (e: SyntheticEvent<HTMLDivElement, TouchEvent>) => {
    sliderPosition.startPositionX = e.touches[0].clientX;
  };
  const touchEndHandler = (e: SyntheticEvent<HTMLDivElement, TouchEvent>) => {
    const currentX = e.changedTouches[0].clientX;
    const startX = sliderPosition.startPositionX;
    const endX = sliderPosition.endPositionX;
    const x = -1 * (startX - currentX) + endX;

    let imageNumber = Math.abs(Math.round(x / sliderPosition.childrenWidth));
    sliderPosition.endPositionX =
      imageNumber * sliderPosition.childrenWidth * -1;
    if (sliderPosition.endPositionX < sliderPosition.maxPositionX) {
      imageNumber--;
    }
    if (x > 0) {
      sliderPosition.endPositionX = 0;
      return;
    }
    smoothSlideToPhoto(sliderPosition, imagesContainerRef, currentX);
    // transfromX(
    //   sliderPosition.endPositionX,
    //   sliderPosition,
    //   imagesContainerRef.current
    // );
    // setImageNumber(imageNumber + 1);
  };

  const sliderBtnHandler = (o) => {
    const currentPositionX =
      sliderPosition.positionX + o * sliderPosition.childrenWidth;
    sliderPosition.endPositionX = sliderPosition.positionX;
    const maxPositionX = sliderPosition.maxPositionX;
    let x =
      Math.round(currentPositionX / sliderPosition.childrenWidth) *
      sliderPosition.childrenWidth;
    x = x < maxPositionX ? maxPositionX : x;
    transfromX(x, sliderPosition, imagesContainerRef.current);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} ref={sliderRef}>
      <div
        ref={imagesContainerRef}
        className={'h-[200px] w-full flex-nowrap z-10 flex bg-slate-400  '}
        onTouchMove={touchHandler}
        onTouchStart={touchStartHandler}
        onTouchEnd={touchEndHandler}>
        {imagesUrl.map((url) => {
          return <SliderItem src={url} key={url}></SliderItem>;
        })}
      </div>
      <button className={`hidden`} onClick={() => sliderBtnHandler(1)}>
        {'<'}
      </button>
      <button className={`hidden`} onClick={() => sliderBtnHandler(-1)}>
        {'>'}
      </button>
      <div className=' absolute  bottom-0 right-0 bg-white text-lg '>
        {imageNumber}/{imagesUrl.length}
      </div>
    </div>
  );
};

const SliderItem = ({ src }): JSX.Element => {
  return (
    <div className='w-full shrink-0 relative  '>
      <Image
        layout='fill'
        objectFit='cover'
        src={`https://llryklqvbwstlcapwgav.supabase.co/storage/v1/object/public/challenges/${src}`}
        alt='challengeImage'></Image>
    </div>
  );
};

export default ImageSlider;