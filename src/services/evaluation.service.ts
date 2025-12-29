import { MessageEvaluation, EvaluationRating } from "@/types/message-evaluation";

export class EvaluationService {
  private static STORAGE_KEY = "message-evaluations";

  /**
   * Сохранить или обновить оценку сообщения
   */
  static saveEvaluation(messageId: string, rating: EvaluationRating, comment?: string): MessageEvaluation {
    const evaluations = this.getAllEvaluations();
    const existingIndex = evaluations.findIndex((e) => e.messageId === messageId);

    const evaluation: MessageEvaluation = {
      messageId,
      rating,
      comment: comment?.trim() || undefined,
      createdAt: existingIndex >= 0 ? evaluations[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      evaluations[existingIndex] = evaluation;
    } else {
      evaluations.push(evaluation);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(evaluations));
    return evaluation;
  }

  /**
   * Получить оценку для сообщения
   */
  static getEvaluation(messageId: string): MessageEvaluation | null {
    const evaluations = this.getAllEvaluations();
    return evaluations.find((e) => e.messageId === messageId) || null;
  }

  /**
   * Получить все оценки
   */
  static getAllEvaluations(): MessageEvaluation[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  /**
   * Удалить оценку
   */
  static deleteEvaluation(messageId: string): boolean {
    const evaluations = this.getAllEvaluations();
    const filtered = evaluations.filter((e) => e.messageId !== messageId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return filtered.length < evaluations.length;
  }

  /**
   * Получить статистику оценок
   */
  static getStatistics(): {
    total: number;
    average: number;
    distribution: Record<number, number>;
  } {
    const evaluations = this.getAllEvaluations();
    if (evaluations.length === 0) {
      return { total: 0, average: 0, distribution: {} };
    }

    const sum = evaluations.reduce((acc, e) => acc + e.rating, 0);
    const average = sum / evaluations.length;

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    evaluations.forEach((e) => {
      distribution[e.rating] = (distribution[e.rating] || 0) + 1;
    });

    return {
      total: evaluations.length,
      average: Math.round(average * 10) / 10,
      distribution,
    };
  }
}

