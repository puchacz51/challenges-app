import { NextPage } from 'next';
import Image from 'next/image';
import { Form } from 'formik';
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
    <div className='text-lg px-[5%] py-2 text-white bg-slate-900 '>Options</div>
  );
};
const ChellengesList: JSX.Element = () => {
  return (
    <div className='min-h-[200px] bg-slate-500 mx-[5%] border-4 mt-2 border-yellow-400'>
      <ChellengeNode />
    </div>
  );
};
const ChellengeNode: React.ReactNode = () => {
  return (
    <div className='grid grid-rows-5 grid-cols-4 rounded '>
      <div className='col-span-4 row-span-4 bg-slate-200 relative h-[150px]'>
        <Image
          src='https://tueuropa.pl/uploads/articles_files/2021/11/05/6e7f9516-1948-d9e8-ca22-00007380aca5.jpg'
          objectFit='cover'
          layout='fill'
          alt='title image'></Image>
        <h3 className=' text-4xl absolute bottom-0 left-2  '>title</h3>
      </div>

      <span className='col-span-2 '>time</span>
      <span className='col-span-2'>status</span>
    </div>
  );
};
