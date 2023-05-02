import Link from 'next/link';
import { ChallengeNode } from '../challenges/ChallengesList';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../services/Store/store';
import { useChallengesQuery } from '../utilities/useChallengeQuery';
import { UserProfileChallnges } from './ChallengeSection';
import {
  UserProfileSection,
  setSection,
} from '../../services/Store/userProfileSlice';

const UserProfileStats = () => {
  return <div></div>;
};

const userProfileSectionSelector = {
  CHALLENGES: <UserProfileChallnges />,
};
export const ProfileSections = () => {
  const { selectedSection, user } = useAppSelector(
    (state) => state.UserProfile
  );
  const dispatch = useAppDispatch();
  const setSelectedSection = (selectedSection: UserProfileSection) => {
    dispatch(setSection(selectedSection));
  };

  return (
    <>
      <div className='border-2 border-black'>
        <div className='border-b-2 border-black p-1 flex justify-center gap-3 uppercase text-lg font-bold'>
          <button onClick={() => setSelectedSection('CHALLENGES')}>
            challenges
          </button>
          <button onClick={() => setSelectedSection('STATS')}>stats</button>
          <button onClick={() => setSelectedSection('CHALLENGES')}>
            contribution
          </button>
        </div>
      </div>
      <section>{userProfileSectionSelector[selectedSection]}</section>
    </>
  );
};
