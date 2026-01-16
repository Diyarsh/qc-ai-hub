import { AgentEvaluation, EvaluationRating } from "@/types/agent-evaluation";
import { mockEvaluations } from "./agent-evaluation.mock";

export class AgentEvaluationService {
  private static STORAGE_KEY = "agent-evaluations";
  private static MOCK_DATA_INITIALIZED_KEY = "agent-evaluations-mock-initialized";

  /**
   * Сохранить или обновить оценку агента
   */
  static saveEvaluation(agentId: string, rating: EvaluationRating): AgentEvaluation {
    const evaluations = this.getAllEvaluations();
    const existingIndex = evaluations.findIndex(
      (e) => e.agentId === agentId && !e.userId // В текущей реализации без userId, можно расширить
    );

    const evaluation: AgentEvaluation = {
      agentId,
      rating,
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
   * Получить оценку текущего пользователя для агента
   */
  static getEvaluation(agentId: string): AgentEvaluation | null {
    const evaluations = this.getAllEvaluations();
    return evaluations.find((e) => e.agentId === agentId && !e.userId) || null;
  }

  /**
   * Получить все оценки для агента
   */
  static getAllEvaluationsForAgent(agentId: string): AgentEvaluation[] {
    const evaluations = this.getAllEvaluations();
    return evaluations
      .filter((e) => e.agentId === agentId)
      .sort((a, b) => {
        // Сортируем по дате обновления или создания (новые сверху)
        const dateA = new Date(a.updatedAt || a.createdAt).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt).getTime();
        return dateB - dateA;
      });
  }

  /**
   * Получить все оценки
   */
  static getAllEvaluations(): AgentEvaluation[] {
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
  static deleteEvaluation(agentId: string): boolean {
    const evaluations = this.getAllEvaluations();
    const filtered = evaluations.filter((e) => !(e.agentId === agentId && !e.userId));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return filtered.length < evaluations.length;
  }

  /**
   * Получить статистику оценок для агента
   */
  static getStatistics(agentId: string): {
    total: number;
    average: number;
    distribution: Record<number, number>;
  } {
    const evaluations = this.getAllEvaluationsForAgent(agentId);
    if (evaluations.length === 0) {
      return { total: 0, average: 0, distribution: {} };
    }

    const sum = evaluations.reduce((acc, e) => acc + e.rating, 0);
    const average = sum / evaluations.length;

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    evaluations.forEach((e) => {
      distribution[e.rating] = (distribution[e.rating] || 0) + 1;
    });

    return {
      total: evaluations.length,
      average: Math.round(average * 10) / 10,
      distribution,
    };
  }

  /**
   * Инициализировать мокапные данные (только один раз)
   */
  static initializeMockData(): void {
    const initialized = localStorage.getItem(this.MOCK_DATA_INITIALIZED_KEY);
    if (initialized === "true") {
      return; // Уже инициализировано
    }

    const existingEvaluations = this.getAllEvaluations();
    
    // Добавляем только мокапные данные с userId (не перезаписываем пользовательские оценки)
    const mockDataToAdd = mockEvaluations.filter(
      (mock) => !existingEvaluations.some(
        (existing) => existing.agentId === mock.agentId && !existing.userId
      )
    );

    if (mockDataToAdd.length > 0) {
      const allEvaluations = [...existingEvaluations, ...mockDataToAdd];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allEvaluations));
    }

    localStorage.setItem(this.MOCK_DATA_INITIALIZED_KEY, "true");
  }

  /**
   * Сбросить мокапные данные (для тестирования)
   */
  static resetMockData(): void {
    localStorage.removeItem(this.MOCK_DATA_INITIALIZED_KEY);
    localStorage.removeItem(this.STORAGE_KEY);
    this.initializeMockData();
  }
}
