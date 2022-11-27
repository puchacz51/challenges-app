import { useQuery } from 'react-query';
import { Reaction } from '../../components/challenges/challengeReactions';
import { ChallengeSteps } from '../../components/forms/ChallengeSteps';
import { supabase } from '../../services/supabase/supabase';
interface Challenge {
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
  challengeSteps: ChallengeSteps;
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
console.log(challenge);

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
  console.log(reactions.data,{ reactions: [], userReaction: null });
  
  if(!reactions.data.length) return { reactions: [], userReaction: null };
  
  if (userId) {
    userReaction = reactions?.data?.find((reaction) => reaction.userId == userId)||null;;
  }
  console.log({ reactions: reactions.data, userReaction: userReaction });

  return { reactions: reactions.data, userReaction: userReaction };
};

export const useChallengeReactionQuery = (
  challengeId: string,
  userId: string
) =>
  useQuery<ChallengeReactionsData>(['reactions', Number(challengeId), userId], {
    queryFn: () => fetchChallengeReactions(challengeId, userId),
    enabled: false,
  });
