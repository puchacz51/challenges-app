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

interface ChallengeQuery {
  challenge: Challenge;
  reactions: Reaction[];
}

export const fetchChallenge = async (idChallenge: number): Promise<ChallengeQuery> => {
  try {
    const challenge = await supabase
      .from('challenges')
      .select('*,reactions(userId,reaction)')
      .eq('id', idChallenge);
    const reactions = await supabase
      .from('reactions')
      .select('reaction,userId')
      .eq('challengeId', idChallenge);
      
    return {
      challenge: challenge.data[0] as Challenge,
      reactions: reactions.data as Reaction[],
    };
  } catch (err) {
    throw err;
  }
};

export const useChallengeQuery = (challengeId:number) =>
  useQuery<ChallengeQuery>([challengeId], {
    queryFn: () => fetchChallenge(challengeId),
    enabled: false,
  });


  