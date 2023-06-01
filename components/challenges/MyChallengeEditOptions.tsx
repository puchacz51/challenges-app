import { AiFillEdit } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '../../services/Store/store';
import {
  setEditOptionIsOpen,
  setView,
} from '../../services/Store/myChallengeSlice';
import { GiCancel } from 'react-icons/gi';
import { FaTrashAlt } from 'react-icons/fa';
import { BiEditAlt } from 'react-icons/bi';
import { GrInProgress } from 'react-icons/gr';
import { useDeleteChallengeMutation } from '../utilities/useChallengeMutation';
const EditOptions = () => {
  const { mutate: deleteChallenge } = useDeleteChallengeMutation();
  const { selectedView } = useAppSelector((state) => state.myChallenge);
  const distpach = useAppDispatch();
  const remove = () => deleteChallenge();
  const changeView = () => {
    distpach(setView(selectedView === 'INFO' ? 'STATUS' : 'INFO'));
  };
  return (
    <div className='absolute bottom-[105%] right-0 text-2xl font-bold flex flex-col bg-slate-600 rounded-md overflow-hidden '>
      {selectedView === 'STATUS' ? (
        <button className='border-2 border-gray-900 py-2 px-4 uppercase flex gap-2 items-center'>
          <BiEditAlt />
          edit
        </button>
      ) : (
        <button>
          <GrInProgress className='border-2 border-gray-900 py-2 px-4 uppercase flex gap-2 items-center' />
          progress
        </button>
      )}
      <button
        onClick={remove}
        className='border-2  border-gray-900 py-2 px-4 uppercase flex gap-2 items-center'>
        <FaTrashAlt /> remove
      </button>
    </div>
  );
};

export const MyChallengeEditOption = () => {
  const isOpen = useAppSelector((state) => state.myChallenge.editOptionIsOpen);
  const dispatch = useAppDispatch();
  const toggleIsOpen = () => dispatch(setEditOptionIsOpen(!isOpen));

  return (
    <div className='fixed bottom-5 right-5'>
      {isOpen && <EditOptions />}
      <button
        onClick={toggleIsOpen}
        className={` text-4xl p-4 rounded-xl shadow-lg shadow-black border-2 border-black ${
          isOpen ? 'bg-yellow-600 ' : 'bg-yellow-300'
        }`}>
        {isOpen ? <GiCancel /> : <AiFillEdit />}
      </button>
    </div>
  );
};
