import { useEffect, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { MdFilterAlt } from 'react-icons/md';
import { DateInput } from '../inputs/DateInput';
import Select from 'react-select';
import {
  CHALLENGECATEGORIES,
  ChallengeCategory,
  ChallengeStatus,
  clearFilter,
  setCategory,
  setFilterDate,
  setFiterStatus,
} from '../../services/Store/challengesFilterSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../services/Store/store';

const CategoriesList = ({
  selectCategory,
}: {
  selectCategory: (category: string) => void;
}) => {
  const { filterCategory } = useAppSelector((state) => state.challengesFilter);
  const isSelected = (category: ChallengeCategory) =>
    filterCategory.includes(category);

  return (
    <div className='flex flex-wrap justify-around '>
      {CHALLENGECATEGORIES.map((category) => (
        <button
          className={`border-2 border-black rounded-md p-1 ${
            isSelected(category) && 'bg-green-600'
          }`}
          key={category}
          onClick={() => selectCategory(category)}>
          {category}
        </button>
      ))}
      
    </div>
  );
};
const SelectStatus = () => {
  const dispatch = useDispatch();
  const { filterStatus } = useAppSelector((state) => state.challengesFilter);

  return (
    <Select
      value={{ value: filterStatus, label: filterStatus }}
      options={
        [
          { value: '*', label: 'ALL' },
          { value: 'COMPLITED', label: 'COMPLITED' },
          { value: 'ACTIVE', label: 'ACTIVE' },
          { value: 'PAUSED', label: 'PAUSED' },
        ] as { value: ChallengeStatus; label: string }[]
      }
      onChange={(val) => dispatch(setFiterStatus(val.value))}
    />
  );
};

export const ChallengeListFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const filterData = useAppSelector((state) => state.challengesFilter);
  const dispatch = useDispatch();
  useEffect(() => {}, [filterData]);
  if (isOpen)
    return (
      <button onClick={() => setIsOpen(true)}>
        <MdFilterAlt />
      </button>
    );
  return (
    <div className='border-2 border-black '>
      <button onClick={() => setIsOpen(false)}>
        <AiFillCloseCircle />
      </button>
      <div className='border-2 border-violet-500'>
        <DateInput
          value={filterData.filterData}
          name='filterDate'
          onChange={(e) => dispatch(setFilterDate(e.currentTarget.value))}
        />
        <CategoriesList
          selectCategory={(category) =>
            dispatch(setCategory(category as ChallengeCategory))
          }
        />
      </div>
      <button onClick={() => dispatch(clearFilter())} className=' uppercase '>
        clear
      </button>
    </div>
  );
};
