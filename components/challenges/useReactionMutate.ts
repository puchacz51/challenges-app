import { useMutation } from 'react-query';
import { supabase } from '../../services/supabase/supabase';

interface MutateReactionProps {
  challegeId: number;
  reactionId: number;
  userId:string;
}

const mutateReaction = async (props:MutateReactionProps) => {
	await supabase.from('reactions').update({reaction:props.reactionId}).eq('challengeId',props.challegeId).eq('userId',props.userId)
};

const useReactionMutation = (challegeId: number) =>
  useMutation({
    mutationFn: mutateReaction
	
  });
