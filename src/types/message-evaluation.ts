export interface MessageEvaluation {
  messageId: string;
  rating: number; // 1-5 stars
  comment?: string;
  createdAt: string; // ISO string
  updatedAt?: string; // ISO string
}

export type EvaluationRating = 1 | 2 | 3 | 4 | 5;






