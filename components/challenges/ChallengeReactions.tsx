import { AiTwotoneLike } from 'react-icons/ai';
import { FaHotjar } from 'react-icons/fa';

const reactions = [
  { id: 1, name: 'like', icon: null },
  { id: 2, name: 'wow', icon: null },
  { id: 3, name: 'dislike', icon: null },
  { id: 4, name: 'like', icon: null },
];

const ChallengeReactions = () => {
  return (
    <div className='text-4xl flex justify-around'>
      <div className='reactionBtn'>
        <AiTwotoneLike />
      </div>
      <div className='reactionBtn'>
        <AiTwotoneLike />
      </div>
      <div className='reactionBtn'>
        <AiTwotoneLike />
      </div>{' '}
      <div className='reactionBtn'>
        <AiTwotoneLike />
      </div>
    </div>
  );
};
export default ChallengeReactions;
