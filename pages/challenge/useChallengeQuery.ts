import { useQuery } from 'react-query';
import { Reaction } from '../../components/challenges/ChallengeReactions';
import { ChallengeStepForm, ChallengeSteps } from '../../components/forms/ChallengeSteps';
import { supabase } from '../../services/supabase/supabase';
export interface Challenge {
  id: string;
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
  challengeSteps: ChallengeStepForm;
}

export interface ChallengeReactionsData {
  reactions: Reaction[];
  userReaction: Reaction;
  oldUserReaction?: Reaction;
}

export const fetchChallenge = async (
  idChallenge:string
): Promise<Challenge> => {
  try {
    const challenge = await supabase
      .from<Challenge>('challenges')
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
    .from<Reaction>('reactions')
    .select('reactionId,userId')
    .eq('challengeId', challegeId);
  let userReaction = null;
  
  if(!reactions.data.length) return { reactions: [], userReaction: [] };
  
  if (userId) {
    userReaction = reactions?.data?.find((reaction) => reaction.userId == userId)||null;;
  }
  
  return { reactions: reactions.data, userReaction: userReaction };
};

export const useChallengeReactionQuery = (
  challengeId: string,
  userId: string
) =>
  useQuery<ChallengeReactionsData>(['reactions', challengeId, userId], {
    queryFn: () => fetchChallengeReactions(challengeId, userId),
    enabled: false,
  });
