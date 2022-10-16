import ImageSlider from './ImageSlider';

const ViewChallenge = ({challengeData}) => {
  const { title, description, createdAt, images }=challengeData
  return (
    <div className='flex flex-col'>
      <h2 className='text-3xl uppercase text-center bg-slate-500'>{title}</h2>
      <ImageSlider className=' border-4' imagesUrl={images}></ImageSlider>
      <	p>{description}</p>
      <span>{createdAt}</span>
    </div>
  );
};

export default ViewChallenge;
