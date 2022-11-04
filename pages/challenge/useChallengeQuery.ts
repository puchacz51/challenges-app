import { useQuery } from 'react-query';
import { Reaction } from '../../components/challenges/challengeReactions';
import { supabase } from '../../services/supabase/supabase';

interface Challenge {
  id: number;
  title: string;
  description: string;
  userId: string;
  isActive: boolean;
  isPublic: boolean;
  createdAt: string;
  images: string[];
  status: 'Active' | 'Poused' | 'Banned';
  endTime?: string;
  startTime?: string;
}

export interface ChallengeReactionsData {
  reactions: Reaction[];
  userReaction: Reaction;
}

export const fetchChallenge = async (
  idChallenge: number
): Promise<Challenge> => {
  try {
    const challenge = await supabase
      .from<Challenge>('challenges')
      .select('*')
      .eq('id', idChallenge);

    return challenge.data[0];
  } catch (err) {
    throw err;
  }
};

export const useChallengeQuery = (challengeId: number) =>
  useQuery<Challenge>(['challenge', challengeId], {
    queryFn: () => fetchChallenge(challengeId),
    enabled: false,
  });

export const fetchChallengeReactions = async (
  challegeId: number,
  userId: string
) => {
  const reactions = await supabase
    .from<Reaction>('reactions')
    .select('reactionId,userId')
    .eq('challengeId', challegeId);
  const userReaction = reactions.data.find(
    (reaction) => reaction.userId == userId
  );
  
  return { reactions: reactions.data, userReaction:userReaction||null };
};

export const useChallengeReactionQuery = (challengeId: number, userId: string) =>
  useQuery<ChallengeReactionsData>(['reactions', challengeId, userId], {
    queryFn: () => fetchChallengeReactions(challengeId, userId),
    enabled: false,
  });
