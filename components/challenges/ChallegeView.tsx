import { supabase } from '../../services/supabase/supabase';
import ChallengeReactions from './challengeReactions';
import ImageSlider from './ImageSlider';

// const ownQuery = async ()=>{
//   const result =  await supabase.rpc('get_challenge')
// }


const ViewChallenge = ({ challengeData }) => {
  const { title, description, createdAt, images } = challengeData.challenge;
  const challengeReactions= challengeData.reactions
  return (
    <div className='hidden flex flex-col bg-slate-200'>
      <h2 className='text-3xl uppercase text-center bg-slate-500 font-semibold'>
        {title}
      </h2>
      <ImageSlider imagesUrl={images}></ImageSlider>
      <p>{description}</p>
      <span>created at {new Date(createdAt).toDateString()}</span>
      <ChallengeReactions reactionsData={challengeReactions} />
    </div>
  );
};

export default ViewChallenge;
