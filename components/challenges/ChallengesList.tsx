import { User } from "@supabase/supabase-js";
import { useSelector } from "react-redux";
import { RootState } from "../../services/Store/store";
import { useChallengeQuery } from "../utilities/usePostQuery";
import Image from 'next/image'
import moment from "moment";
const ChallengesList = (): JSX.Element => {
  const user = useSelector<RootState>((state) => state.authInfo?.user) as User;

  const { data, refetch, isLoading } = useChallengeQuery(user.id);

  if (isLoading && !data) {
    return <h2>loading ...</h2>;
  }

  return (
    <div className='min-h-[200px] bg-green-500 mx-[5%] border-4 mt-2 border-yellow-400'>
      {data?.map((challengeData) => (
        <ChellengeNode key={challengeData.id} challengeData={challengeData} />
      ))}
    </div>
  );
};


const ChellengeNode = ({ challengeData }): JSX.Element => {
  const { title, images, createdAt } = challengeData;
	const time = moment(new Date(createdAt).getTime()).fromNow()
	
  return (
    <div className='grid grid-rows-5 grid-cols-4 my-3 rounded bg-slate-900 '>
      <div className='col-span-4 row-span-4  bg-slate-200 relative h-[150px]'>
        <Image
          src={`https://llryklqvbwstlcapwgav.supabase.co/storage/v1/object/public/challenges/${images[0]}`}
          objectFit='cover'
          layout='fill'
          alt='title image'></Image>
        <h3 className=' text-4xl absolute bottom-0 left-2  '>{title}</h3>
      </div>
      <span className='col-span-2 uppercase text-white px-2'>{time}</span>
      <span className='col-span-2'>status</span>
    </div>
  );
};



export { ChallengesList };


