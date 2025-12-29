export interface AgentEvaluation {
  agentId: string;
  rating: number; // 1-5 stars
  comment?: string;
  createdAt: string; // ISO string
  updatedAt?: string; // ISO string
  userId?: string; // Optional user identifier for multi-user scenarios
}

export type EvaluationRating = 1 | 2 | 3 | 4 | 5;
