import { useMutation, useQueryClient } from 'react-query';
import { ChallengeQuery } from '../../pages/challenge/useChallengeQuery';
import { supabase } from '../../services/supabase/supabase';
import { Reaction } from './challengeReactions';

interface MutateReactionProps {
  challegeId: number;
  reactionId: number;
  userId:string;
  userReaction:Reaction|null;
}

const mutateReaction = async (props:MutateReactionProps) => {
	const {challegeId,reactionId,userId,userReaction} = props
	if(! userReaction){
	await supabase.from('reactions').insert({reaction:reactionId,challegeId,userId}).eq('challengeId',challegeId).eq('userId',userId)
	}
	else if( reactionId==userReaction.reaction){
	await supabase.from('reactions').delete().eq('challengeId',challegeId).eq('userId',userId)
	}
	await supabase.from('reactions').update({reaction:reactionId}).eq('challengeId',challegeId).eq('userId',userId)
	return props
};
const changeReactions=(challege:ChallengeQuery,props:MutateReactionProps)=>{
	const {userId,reactionId,challegeId,userReaction} =props
	if( userReaction.reaction=== reactionId){
		const newChallenge = challege.reactions.filter(reaction=>reaction.userId!=userId)
		return newChallenge
	}
	else if(!userReaction){
		const newReaction = {userId}
		const newChallenge = {...challege,reactions:{challege.reactions}}
	}
	const newChallengeReactions = data.reactions

	
}
const useReactionMutation = (challegeId:number) =>{
	const queryClient = useQueryClient()
	return useMutation({
    mutationFn: mutateReaction,
	onMutate:async (props:MutateReactionProps)=>{
	await queryClient.cancelQueries(['challenge',challegeId])
	const challenge = await queryClient.getQueryData(['challenge', challegeId])

})
}