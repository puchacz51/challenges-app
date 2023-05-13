import { type } from 'os';
import { Database } from '../services/supabase/schema';
export type Challenge = Database['public']['Tables']['challenges']['Row'];
export type ChallengeInsert =
  Database['public']['Tables']['challenges']['Insert'];

export type ChallengeStep =
  Database['public']['Tables']['challengeSteps']['Row'];

export type ChallengeStepInsert =
  Database['public']['Tables']['challengeSteps']['Insert'];

export type ChallengeCategory =
  | 'SPORT'
  | 'CREATIVITY'
  | 'SELF-IMPROVMENT'
  | 'FINANCE';

export type ChallengeStatus = 'COMPLETED' | 'ACTIVE' | 'ALL' | 'PAUSED';
export const CHALLENGECATEGORIES: ChallengeCategory[] = [
  'SPORT',
  'CREATIVITY',
  'SELF-IMPROVMENT',
  'FINANCE',
];
export const CHALLENGESTATUSES: ChallengeStatus[] = [
  'COMPLETED',
  'ACTIVE',
  'ALL',
  'PAUSED',
];

export type ChallengeWithSteps = Challenge & {
  challengeSteps: ChallengeStep[];
};

export interface ChallengeReactionsData {
  reactions: Reaction[];
  userReaction: Reaction;
  oldUserReaction?: Reaction;
}
export type Reaction = Database['public']['Tables']['reactions']['Row'];