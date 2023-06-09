import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../services/Store/store';
import { useChallengeQuery } from '../../utilities/useChallengeQuery';
import { useRouter } from 'next/router';
import { setCurrentChallenge } from '../../../services/Store/myChallengeSlice';

export const UpdateChallengeForm = () => {
  const dispatch = useAppDispatch();
  const { query } = useRouter();
  const { id: challengeId } = query;
  const { data: challengeData } = useChallengeQuery(challengeId as string);
  const { title } = challengeData;
  useEffect(() => {
    dispatch(setCurrentChallenge);
  }, [challengeData]);

  return (
    <div className='min-h-screen'>
      <h2 className='w-full border-2 border-black'>challengeEdited {title} </h2>
    </div>
  );
};
