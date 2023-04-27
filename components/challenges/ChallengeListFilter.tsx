import { FormEvent, useEffect, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { MdFilterAlt } from 'react-icons/md';
import { DateInput } from '../inputs/DateInput';
import { SelectBox } from '../inputs/SelectBox';
import Select from 'react-select';

type ChallengeListFilter = {
  filterData: Date;
  filterStatus: 'COMPLITED' | 'IDLE' | 'INPROGRESS' | 'All';
  filterIsPublic: 'PUBLIC' | 'PRIVATE' | 'ALL';
};
const initialFilterData: ChallengeListFilter = {
  filterData: new Date(0),
  filterStatus: 'All',
  filterIsPublic: 'ALL',
};

export const ChallengeListFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterData, setFilterData] = useState(initialFilterData);
  useEffect(() => {
    console.log(filterData);
  }, [filterData]);
  const handleData = (e: FormEvent<HTMLInputElement>) => {

    console.log(e.currentTarget?.value);
    
    if (!e.currentTarget?.value) return;
    console.log('dziala');
    
    setFilterData((oldState) => ({
      ...oldState,
      filterData: new Date(e.currentTarget.value),
    }));
  };
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
        <DateInput name='filterDate' onChange={handleData} />
        <Select
          options={[
            { value: 'All', label: 'ALL' },
            { value: 'COMPLITED', label: 'COMPLITED' },
            { value: 'INPROGRESS', label: 'IN PROGRESS' },
          ]}
          onChange={(selectedStatus) =>
            setFilterData((oldstate) => ({
              ...oldstate,
              filterStatus:
                selectedStatus.value as ChallengeListFilter['filterStatus'],
            }))
          }
        />
      </div>

      <button className=' uppercase '>clear</button>
    </div>
  );
};
