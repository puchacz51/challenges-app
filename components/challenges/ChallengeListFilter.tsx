import { useEffect, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { MdSelfImprovement } from 'react-icons/md';
import { TbReportMoney } from 'react-icons/tb';
import { SiMusicbrainz } from 'react-icons/si';
import { BiRun } from 'react-icons/bi';
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
import { IconType } from 'react-icons/lib';

type CategoryIconsType = { [key in ChallengeCategory]: IconType };

const CategoriesIcons: CategoryIconsType = {
  SPORT: BiRun,
  CREATIVITY: SiMusicbrainz,
  'SELF-IMPROVMENT': MdSelfImprovement,
  FINANCE: TbReportMoney,
};

const CategoriesList = ({
  selectCategory,
}: {
  selectCategory: (category: string) => void;
}) => {
  const { filterCategory } = useAppSelector((state) => state.challengesFilter);
  const isSelected = (category: ChallengeCategory) =>
    filterCategory.includes(category);
  return (
    <div
      className='flex flex-wrap justify-around   border-y border-black my-2
    '>
      <h4 className='border-b-2 border-black w-full mb-2 p-2 text-center text-xl font-semibold uppercase'>
        select categories
      </h4>
      {CHALLENGECATEGORIES.map((category) => {
        const CategoryIcon = CategoriesIcons[category];

        return (
          <button
            className={`border-2 border-black rounded-md text-2xl p-1 ${
              isSelected(category) && 'bg-green-600'
            }`}
            key={category}
            onClick={() => selectCategory(category)}>
            <CategoryIcon />
          </button>
        );
      })}
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
  const filterData = useAppSelector((state) => state.challengesFilter);
  const dispatch = useDispatch();
  useEffect(() => {}, [filterData]);
  if (filterData.filterIsOpen) return <></>;
  return (
    <div className='border-2 border-black '>
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
