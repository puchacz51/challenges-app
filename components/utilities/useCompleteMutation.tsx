import { useMutation, useQuery, useQueryClient } from 'react-query';
import { supabase } from '../../services/supabase/supabase';
import { ChallengeWithSteps } from './useChallengeQuery';
const completeChallengeStep = async (
  challengeId: string,
  stepId: number,
  status: boolean
) => {
  const { data, error } = await supabase
    .from('challengeSteps')
    .update({ completed: status })
    .eq('challengeId', challengeId)
    .eq('stepId', stepId);
  if (error) return { error };
  return { data };
};

export const useCompleteStepMutation = (challegeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['challenge', challegeId],
    mutationFn: ({ stepId, status }: { stepId: number; status: boolean }) =>
      completeChallengeStep(challegeId, stepId, status),
    onMutate: async ({ stepId, status }) => {
      await queryClient.cancelQueries({ queryKey: [challegeId] });
      const OldQueryData = queryClient.getQueryData<ChallengeWithSteps>([
        challegeId,
      ]);
      queryClient.setQueryData<ChallengeWithSteps>(
        ['challenge', challegeId],
        (state) => {
          const { challengeSteps } = state;
          const newCHallengeSteps = challengeSteps.map((step) =>
            step.stepId === stepId ? { ...step, completed: status } : step
          );
          return { ...state, challengeSteps: newCHallengeSteps };
        }
      );
      return OldQueryData;
    },
    onError: (_err, { stepId, status }, ctx) => {
      queryClient.setQueryData<ChallengeWithSteps>(
        ['challenge', challegeId],
        (state) => {
          const { challengeSteps } = state;
          const newCHallengeSteps = challengeSteps.map((step) =>
            step.stepId === stepId ? { ...step, completed: !status } : step
          );
          return { ...state, challengeSteps: newCHallengeSteps };
        }
      );
    },
  });
};

// export const useCompleteChallengeMutation()
