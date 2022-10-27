import { AiTwotoneLike, AiFillDislike } from 'react-icons/ai';
import { DiCodeigniter } from 'react-icons/di';
import { GiBrain } from 'react-icons/gi';
const reactions = [
  { id: 1, name: 'like', Icon: AiTwotoneLike,color:"" },
  { id: 2, name: 'wow', Icon: DiCodeigniter },
  { id: 3, name: 'dislike', Icon: AiFillDislike },
  { id: 4, name: 'smart', Icon: GiBrain },
];
const ReactionElement = ({ reactionId, amount }) => {
  const { Icon, name } = reactions[reactionId];

  return (
    <button className='reactionBtn relative border-none '>
      <span className='hidden  '>{reactions[reactionId].name}</span>
      <Icon></Icon>
      <span className='absolute flex items-center justify-center text-base  bg-white  rounded-xl w-5 h-5 translate-x-2 -translate-y-2 top-0 right-0'>
        {1}
      </span>
    </button>
  );
};

const ChallengeReactions = ({ reactionsData }) => {
  const handleChange = () => {};

  return (
    <div className={'text-4xl flex justify-around pt-2 bg-white '}>
      {reactions.map((reactionObject, index) => {
        return (
          <ReactionElement amount={0} key={Math.random()} reactionId={index} />
        );
      })}
    </div>
  );
};

export default ChallengeReactions;
