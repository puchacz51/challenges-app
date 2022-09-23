import { NextPage } from 'next';
import Image from 'next/image';

const myChallenges: NextPage = () => {
  return (
    <main className='flex flex-col '>
      <ChellengesOption />
      <ChellengesList />
    </main>
  );
};

export default myChallenges;

const ChellengesOption: JSX.Element = () => {
  return (
    <div className='text-lg px-4 py-2 text-white bg-slate-900 '>Options</div>
  );
};
const ChellengesList: JSX.Element = () => {
  return (
    <div className='min-h-[200px] bg-slate-500 mx-12 border-4 border-yellow-400'>
      <ChellengeNode />
    </div>
  );
};
const ChellengeNode: React.ReactNode = () => {
  return (
    <div className='grid grid-rows-4 grid-cols-4 '>
      <Image
        src='https://tueuropa.pl/uploads/articles_files/2021/11/05/6e7f9516-1948-d9e8-ca22-00007380aca5.jpg'
        width={200}
        height={200}
		objectFit="cover"
		className='col-span-4 row-span-4' 
        alt='title image'></Image>
      <h3 className='col-span-2 text-4xl'>title</h3>
      <span>time</span>
      <span>status</span>
    </div>
  );
};
