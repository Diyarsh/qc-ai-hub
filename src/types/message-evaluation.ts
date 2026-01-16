export interface MessageEvaluation {
  messageId: string;
  rating: number; // 1 = Верно, 2 = Частично верно, 3 = Неверно
  createdAt: string; // ISO string
  updatedAt?: string; // ISO string
}

export type EvaluationRating = 1 | 2 | 3;

export type EvaluationOption = {
  value: EvaluationRating;
  label: string;
  icon: string;
  color: string;
};






