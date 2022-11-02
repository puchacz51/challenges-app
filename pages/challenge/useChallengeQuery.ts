import { useQuery } from 'react-query';
import { Reaction } from '../../components/challenges/challengeReactions';
import { supabase } from '../../services/supabase/supabase';

interface Challenge {
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

export interface ChallengeQuery {
  challenge: Challenge;
  reactions: Reaction[];
  userReaction:Reaction;
}

export const fetchChallenge = async (
  idChallenge: number,
  userId: string
): Promise<ChallengeQuery> => {
  try {
    const challenge = await supabase
      .from('challenges')
      .select('*,reactions(userId,reaction)')
      .eq('id', idChallenge);
    const reactions = await supabase
      .from<Reaction>('reactions')
      .select('reaction,userId')
      .eq('challengeId', idChallenge);
    const userReaction = reactions.data.find(
      (reaction) => reaction.userId == userId
    );
    return {
      challenge: challenge.data[0] as Challenge,
      reactions: reactions.data,
      userReaction
    };
  } catch (err) {
    throw err;
  }
};

export const useChallengeQuery = (challengeId: number, userId: string) =>
  useQuery<ChallengeQuery>(['challenge', challengeId], {
    queryFn: () => fetchChallenge(challengeId, userId),
    enabled: false,
  });
