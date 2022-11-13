import { PostgrestResponse } from '@supabase/supabase-js';
import { SupabaseQueryBuilder } from '@supabase/supabase-js/dist/module/lib/SupabaseQueryBuilder';
import { useMutation, useQueryClient } from 'react-query';
import { ChallengeReactionsData } from '../../pages/challenge/useChallengeQuery';
import { supabase } from '../../services/supabase/supabase';
import { Reaction } from './challengeReactions';

interface MutateReactionProps {
  challegeId: number;
  reactionId: number;
  userId: string;
  userReaction: Reaction | null;
}

const changeReactions = (
  reactions: Reaction[],
  userReaction: Reaction | null,
  newReaction: Reaction
): ChallengeReactionsData => {
  if (!userReaction) {
    const newReactions = [...reactions, newReaction];

    return {
      reactions: newReactions,
      userReaction: newReaction,
      oldUserReaction: userReaction,
    };
  }
  const newReactions = reactions.filter(
    (reaction) => reaction.userId != userReaction.userId
  );
  if (userReaction.reactionId === newReaction.reactionId) {
    return {
      reactions: newReactions,
      userReaction: null,
      oldUserReaction: userReaction,
    };
  }
  return {
    reactions: [...newReactions, newReaction],
    userReaction: newReaction,
    oldUserReaction: userReaction,
  };
};

export const useReactionMutation = (challengeId: number, userId: string) => {

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newReaction: Reaction) => {
      const { reactions, userReaction, oldUserReaction } =
        queryClient.getQueryData<ChallengeReactionsData>([
          'reactions',
          challengeId,
          userId,
        ]);
      const { reactionId } = newReaction;
      let response: PostgrestResponse<Reaction>;
      if (!oldUserReaction?.userId) {
        response = await supabase
          .from<Reaction>('reactions')
          .insert({ ...newReaction })
          .eq('challengeId', challengeId)
          .eq('userId', userId);
      } else if (reactionId == oldUserReaction.reactionId) {
        response = await supabase
          .from<Reaction>('reactions')
          .delete()
          .eq('challengeId', challengeId)
          .eq('userId', userId);
      } else {
        response = await supabase
          .from<Reaction>('reactions')
          .update({ reactionId })
          .eq('challengeId', challengeId)
          .eq('userId', userId);
      }
      if (response.error) {
        throw response.error;
      }
      return { reactions, userReaction };
    },
    onMutate: async (newReaction) => {
      await queryClient.cancelQueries(['reactions', challengeId, userId]);
      const reactionsData = queryClient.getQueryData<ChallengeReactionsData>([
        'reactions',
        challengeId,
        userId,
      ]);
      const { reactions: oldReactions, userReaction } = reactionsData;
      const newReactions = changeReactions(
        oldReactions,
        userReaction,
        newReaction
      );

      queryClient.setQueryData(
        ['reactions', challengeId, userId],
        newReactions
      );
      return oldReactions;
    },
    onError: (err, newReaction, oldReactions) => {
      queryClient.setQueryData(
        ['reactions', challengeId, userId],
        oldReactions
      );
    },
  });
};
