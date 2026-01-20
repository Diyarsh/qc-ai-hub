export interface AgentEvaluation {
  agentId: string;
  rating: number; // 1-5 rating scale
  comment?: string; // Optional comment for the evaluation
  createdAt: string; // ISO string
  updatedAt?: string; // ISO string
  userId?: string; // Optional user identifier for multi-user scenarios
}

export type EvaluationRating = 1 | 2 | 3;

export type EvaluationOption = {
  value: EvaluationRating;
  label: string;
  icon: string;
  color: string;
};
