import { User } from '@supabase/supabase-js';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/Store/store';
import Image from 'next/image';
import moment from 'moment';
import { ChallengeListFilter } from './ChallengeListFilter';
import { useChallengesQuery } from '../utilities/useChallengeQuery';

const ChallengesList = () => {
  const user = useSelector<RootState>((state) => state.authInfo?.user) as User;
  const {
    data: challenges,
    refetch,
    isLoading,
  } = useChallengesQuery(user.id, { enabled: false });

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
        {challenges?.map((challenge) => (
          <ChallengeNode key={challenge.id} challengeData={challenge} />
        ))}
      </div>
    </div>
  );
};

const ChallengeNode = ({ challengeData }): JSX.Element => {
  const { title, images, createdAt, status } = challengeData;
  const time = moment(new Date(createdAt).getTime()).fromNow();
  const src =
    images[0] == 'local'
      ? images[1]
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/challenges/${images[0]}`;
  return (
    <a
      className='w-full grid  grid-rows-5 grid-cols-4 my-3 overflow-hidden rounded-xl bg-slate-900  border-2 border-black '
      href={`challenge/${challengeData.id}`}>
      <div className='col-span-4 row-span-4   bg-slate-200 relative h-[150px]'>
        <Image
          src={src}
          fill
          alt='title image'
          style={{ objectFit: 'cover' }}
          priority
        />
        <h3 className=' text-4xl absolute bottom-0 w-full bg-opacity-30 bg-white '>
          {title}
        </h3>
      </div>
      <span className='col-span-2 uppercase text-white px-2'>{time}</span>
      <span className='col-span-2 uppercase text-white'>{status}</span>
    </a>
  );
};

export { ChallengesList };
