import { UseQueryOptions, useQuery } from 'react-query';
import { ChallengeStepForm } from '../forms/ChallengeSteps';
import { supabase } from '../../services/supabase/supabase';
import { Database } from '../../services/supabase/schema';
import { useState } from 'react';

export type Challenge = Database['public']['Tables']['challenges']['Row'];
export interface ChallengeReactionsData {
  reactions: Reaction[];
  userReaction: Reaction;
  oldUserReaction?: Reaction;
}
export type Reaction = Database['public']['Tables']['reactions']['Row'];

type FetchChallenge = (
  userId: string,
  paginationData?: { from: number; to: number }
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

export const useChallengeQuery = (challengeId: string) =>
  useQuery<Challenge>(['challenge', challengeId], {
    queryFn: () => fetchChallenge(challengeId),
    enabled: false,
  });

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

export const useChallengeReactionQuery = (
  challengeId: string,
  userId: string
) =>
  useQuery<ChallengeReactionsData>(['reactions', challengeId, userId], {
    queryFn: () => fetchChallengeReactions(challengeId, userId),
    enabled: false,
  });

const fetchChallenges: FetchChallenge = async (userId, paginationData) => {
  const { from, to } = paginationData;

  try {
    const result = await supabase
      .from('challenges')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .range(from, to);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const useChallengesQuery = (
  id: string,
  queryAmount: number,
  options?: UseQueryOptions
) => {
  const [queryCount, setQueryCount] = useState(0);

  const currentPagination = {
    from: queryCount * queryAmount,
    to: (queryCount + 1) * queryAmount,
  };

  return useQuery([id], {
    queryFn: () => fetchChallenges(id, currentPagination),
    onSuccess(data) {},
  });
};
