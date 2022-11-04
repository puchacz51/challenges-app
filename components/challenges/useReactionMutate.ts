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

    return { reactions: newReactions, userReaction: newReaction };
  }
  const newReactions = reactions.filter(
    (reaction) => reaction.userId != userReaction.userId
  );
  if (userReaction.reactionId === newReaction.reactionId) {
    return { reactions: newReactions, userReaction: newReaction };
  }
  return {
    reactions: [...newReactions, newReaction],
    userReaction: newReaction,
  };
};

export const useReactionMutation = (challengeId: number, userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newReaction: Reaction) => {
      const { reactions, userReaction } =
        queryClient.getQueryData<ChallengeReactionsData>([
          'reactions',
          challengeId,
          userId,
        ]);
      const { reactionId } = newReaction;

      if (!userReaction) {
        await supabase
          .from<Reaction>('reactions')
          .insert({ ...newReaction })
          .eq('challengeId', challengeId)
          .eq('userId', userId);
      } else if (reactionId == userReaction.reactionId) {
        await supabase
          .from<Reaction>('reactions')
          .delete()
          .eq('challengeId', challengeId)
          .eq('userId', userId);
      }
      await supabase
        .from<Reaction>('reactions')
        .update({ reactionId })
        .eq('challengeId', challengeId)
        .eq('userId', userId);
      return newReaction;
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
      console.log(newReactions, 'new Reaction');

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
    onSuccess: (data) => {
      queryClient.setQueryData(['reactions', challengeId, userId], data);
    },
  });
};
