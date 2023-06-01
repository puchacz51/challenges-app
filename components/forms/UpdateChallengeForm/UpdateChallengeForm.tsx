import { useAppSelector } from '../../../services/Store/store';

export const UpdateChallengeForm = () => {
  const challengeData = useAppSelector(
    (state) => state.myChallenge.currrentChallenge
  );
  const { title } = challengeData;

  return (
    <div className='min-h-screen'>
      <h2 className='w-full border-2 border-black'>challengeEdited {title} </h2>
    </div>
  );
};
