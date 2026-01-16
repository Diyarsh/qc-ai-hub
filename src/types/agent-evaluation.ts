export interface AgentEvaluation {
  agentId: string;
  rating: number; // 1-3: 1 = Плохо, 2 = Средне, 3 = Хорошо
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
