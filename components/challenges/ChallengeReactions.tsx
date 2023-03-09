import { useEffect, useState } from 'react';
import { AiTwotoneLike, AiFillDislike } from 'react-icons/ai';
import { DiCodeigniter } from 'react-icons/di';
import { GiBrain } from 'react-icons/gi';
import { useChallengeReactionQuery } from '../utilities/useChallengeQuery';
import { useReactionMutation } from './useReactionMutate';
const reactionsOptions = [
  { id: 0, name: 'like', Icon: AiTwotoneLike, color: '' },
  { id: 1, name: 'wow', Icon: DiCodeigniter },
  { id: 2, name: 'dislike', Icon: AiFillDislike },
  { id: 3, name: 'smart', Icon: GiBrain },
];
export interface Reaction {
  challengeId: string;
  userId: string;
  reactionId: number;
}

const countReactions = (reactions: Reaction[]) => {
  const initialValue = [0, 0, 0, 0];

  const countedReactions = reactions.reduce((prev, current) => {
    prev[current.reactionId]++;
    return prev;
  }, initialValue);
  return countedReactions;
};

const ReactionElement = ({ reactionId, amount, selected, action }) => {
  const { Icon, name } = reactionsOptions[reactionId];

  return (
    <button
      onClick={action}
      className={`reactionBtn relative border-none  ${
        selected && 'text-blue-500'
      }`}>
      <span className='hidden'>{reactionsOptions[reactionId].name}</span>
      <Icon></Icon>
      <span className='absolute flex items-center justify-center text-base  bg-white  rounded-xl w-5 h-5 translate-x-2 -translate-y-2 top-0 right-0'>
        {amount}
      </span>
    </button>
  );
};

export const ChallengeReactions = ({ userId, challengeId }) => {
  const [amountOfReactions, setAmountOfReactions] = useState([0, 0, 0, 0]);
  const { data: reactionsData } = useChallengeReactionQuery(
    challengeId,
    userId
  );

  const { mutate } = useReactionMutation(challengeId, userId);
  const { reactions, userReaction } = reactionsData;
  useEffect(() => {
    setAmountOfReactions(countReactions(reactions));
  }, [reactions]);
  return (
    <div className={'text-4xl flex justify-around pt-2 bg-white '}>
      {reactionsOptions.map((reactionObject, index) => {
        return (
          <ReactionElement
            selected={userReaction?.reactionId == index}
            amount={amountOfReactions[index]}
            key={Math.random()}
            reactionId={index}
            action={() => mutate({ challengeId, reactionId: index, userId })}
          />
        );
      })}
    </div>
  );
};
