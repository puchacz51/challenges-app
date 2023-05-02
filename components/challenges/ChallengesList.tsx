import { useAppSelector } from '../../services/Store/store';
import Image from 'next/image';
import moment from 'moment';
import { ChallengeListFilter } from './ChallengeListFilter';
import {
  Challenge,
  useChallengesInifitinityQuery,
} from '../utilities/useChallengeQuery';
import { ColHTMLAttributes, HTMLAttributes, useEffect } from 'react';
import Link from 'next/link';

const ChallengesList = () => {
  const user = useAppSelector((state) => state.authInfo?.user);
  const challegesFilter = useAppSelector((state) => state.challengesFilter);
  const {
    data: challenges,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useChallengesInifitinityQuery(user.id, 5);
  useEffect(() => {
    console.log('fitler change');
    refetch();
  }, [challegesFilter]);
  if (isLoading && !challenges) {
    return <h2>loading ...</h2>;
  }
  return (
    <div className='mx-[5%]'>
      <h3 className='text-center mx-auto p-1 uppercase text-2xl font-bold bg-slate-500 '>
        your Challenges
      </h3>
      <ChallengeListFilter />
      <div className='min-h-[200px]  border-4  '>
        {challenges?.pages.map((page) =>
          page?.map((challenge) => (
            <ChallengeNode key={challenge.id} challengeData={challenge} />
          ))
        )}
        {hasNextPage && (
          <button
            className='text-lg bg-yellow-400 w-full uppercase'
            onClick={() => fetchNextPage()}>
            see more
          </button>
        )}
      </div>
    </div>
  );
};

type ChallengeNodeProps = {
  challengeData: Challenge;
  className?: HTMLAttributes<HTMLLinkElement>['className'];
};

export const ChallengeNode = ({
  challengeData,
  className = '',
}: ChallengeNodeProps) => {
  const { title, images, createdAt, status } = challengeData;
  const time = moment(new Date(createdAt).getTime()).fromNow();
  const src =
    images[0] == 'local'
      ? images[1]
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/challenges/${images[0]}`;
  return (
    <Link
      className={
        'block  my-3 overflow-hidden rounded-xl bg-slate-900  border-2 border-black  ' +
        className
      }
      href={`challenge/${challengeData.id}`}>
      <div className='w-full bg-slate-200 relative  aspect-video'>
        <Image
          src={src}
          fill
          alt='title image'
          style={{ objectFit: 'cover' }}
          priority
        />
        <h3 className='text-[2.25em] font-semibold  absolute bottom-0 w-full bg-opacity-40 bg-white p-1'>
          {title}
        </h3>
      </div>
      <div className=' flex  justify-between w-full font-[.7em] items-center p-2 '>
        <span className='uppercase  text-white '>{time}</span>
        <span className='uppercase  text-white '>{status}</span>
      </div>
    </Link>
  );
};

export { ChallengesList };
