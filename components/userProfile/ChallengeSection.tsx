import { useRouter } from 'next/router';
import { useAppSelector } from '../../services/Store/store';
import { useChallengesQuery } from '../utilities/useChallengeQuery';
import { ChallengeNode } from '../challenges/ChallengesList';
import Link from 'next/link';

export const UserProfileChallnges = () => {
  const { asPath } = useRouter();
  const { user } = useAppSelector((state) => state.authInfo);
  const {
    data: challengesData,
    error,
    isLoading,
  } = useChallengesQuery(user.id, 5);
  if (!challengesData || challengesData.length == 0)
    return (
      <div className='flex border-blue border-2 flex-row flex-wrap justify-around'>
        <p>noe challenges</p>
      </div>
    );
  return (
    <div className='flex border-blue border-2 flex-row flex-wrap justify-around'>
      {challengesData.map((challengeData) => (
        <ChallengeNode
          className='w-[48%] text-xs'
          key={challengeData.id}
          challengeData={challengeData}
        />
      ))}
      <Link href={`${asPath}/challenges`}>see all</Link>
    </div>
  );
};
