import {AiTwotoneLike} from 'react-icons/ai'
import { FaHotjar } from 'react-icons/fa';

const reactions = [
  { id: 1, name: 'like', icon: null },
  { id: 2, name: 'wow', icon: null },
  { id: 3, name: 'dislike', icon: null },
  { id: 4, name: 'like', icon: null },
];

const ChallengeReactions = () => {
  return (
    <div className='flex'>
      <div className=''>
        <AiTwotoneLike />
      </div>
      <div className=''>
        <AiTwotoneLike />
      </div>
      <div className=''>
        <AiTwotoneLike />
      </div>
      <div className=''>
        <AiTwotoneLike />
      </div>
    </div>
  );
};
export default ChallengeReactions;
