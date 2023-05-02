import {
  QueryOptions,
  UseQueryOptions,
  useInfiniteQuery,
  useQuery,
} from 'react-query';
import { supabase } from '../../services/supabase/supabase';
import { Database } from '../../services/supabase/schema';
import { store } from '../../services/Store/store';
import { ChallengesFilterSlice } from '../../services/Store/challengesFilterSlice';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';

export type Challenge = Database['public']['Tables']['challenges']['Row'];
export interface ChallengeReactionsData {
  reactions: Reaction[];
  userReaction: Reaction;
  oldUserReaction?: Reaction;
}
export type Reaction = Database['public']['Tables']['reactions']['Row'];

type FetchChallenge = (
  userId: string,
  filterParams: ChallengesFilterSlice,
  paginationData?: number
) => Promise<Challenge[]>;

export const fetchChallenge = async (
  idChallenge: string
): Promise<Challenge> => {
  try {
    const challenge = await supabase
      .from('challenges')
      .select('*,challengeSteps(*)')
      .eq('id', idChallenge);
    return challenge.data[0];
  } catch (err) {
    throw err;
  }
};
export const fetchChallengeReactions = async (
  challegeId: string,
  userId: string
) => {
  const reactions = await supabase
    .from('reactions')
    .select('*')
    .eq('challengeId', challegeId);
  if (reactions.error) throw reactions.error;
  let userReaction = null;
  if (!reactions.data.length) return { reactions: [], userReaction: [] };

  if (userId) {
    userReaction =
      reactions?.data?.find((reaction) => reaction.userId == userId) || null;
  }

  return { reactions: reactions.data, userReaction };
};
const CHALLENGEQUERYAMOUNT = 5;
const fetchChallengesbyUserId = async (userId: string, amount = 4) => {
  try {
    const response = await supabase
      .from('challenges')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .limit(amount - 1);
    if (response.data.length === 0) throw new Error('no data available');
    return response.data;
  } catch (err) {
    throw err;
  }
};

const fetchInfinityChallenges: FetchChallenge = async (
  userId,
  filterParams,
  page = 0
) => {
  let { filterCategory, filterData, filterIsPublic, filterStatus } =
    filterParams;
  try {
    // if (filterData != new Date(0, 0, 0).toISOString()) {
    //   query = () => query().gte('createdAt', filterData);
    // }
    // if (filterIsPublic != 'ALL') {
    //   query = () => query().eq('isPublic', filterIsPublic === 'PUBLIC');
    // }
    // if (filterStatus != 'ALL') {
    //   query = () => query().in('status', [filterStatus]);
    // }
    console.log(filterData);
    
    const result = await supabase
      .from('challenges')
      .select('*')
      .in('category', filterCategory)
      .gte('createdAt', filterData);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const useChallengeQuery = (challengeId: string) =>
  useQuery<Challenge>(['challenge', challengeId], {
    queryFn: () => fetchChallenge(challengeId),
    enabled: false,
  });
export const useChallengeReactionQuery = (
  challengeId: string,
  userId: string
) =>
  useQuery<ChallengeReactionsData>(['reactions', challengeId, userId], {
    queryFn: () => fetchChallengeReactions(challengeId, userId),
    enabled: false,
  });

export const useChallengesInifitinityQuery = (
  id: string,
  queryAmount: number,
  options?: UseQueryOptions,
  filterData?: any
) => {
  return useInfiniteQuery([id, 'myChallenges'], {
    queryFn: async (pageParam) => {
      const currentFilterParams = store.getState().challengesFilter;

      return await fetchInfinityChallenges(
        id,
        currentFilterParams,
        pageParam.pageParam
      );
    },
    keepPreviousData: true,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.length < CHALLENGEQUERYAMOUNT) return undefined;
      if (allPages?.length === 0) {
        return 1;
      }
      return allPages.length + 1;
    },
    getPreviousPageParam: (firstPage, allPages) => {
      if (allPages.length === 0) return undefined;
      return allPages.length;
    },
  });
};

export const useChallengesQuery = (
  userId: string,
  amount = 5,
  queryOptions: QueryOptions<Challenge[]> = {}
) =>
  useQuery<Challenge[]>({
    queryFn: () => fetchChallengesbyUserId(userId, amount),
    ...queryOptions,
  });
