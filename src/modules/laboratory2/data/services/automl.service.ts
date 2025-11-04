import { AutoMLTask, AutoMLModel } from "../components/AutoML";

export class AutoMLService {
  private static STORAGE_KEY = "laboratory2-automl-tasks";

  static save(task: AutoMLTask): void {
    const tasks = this.getAll();
    const existingIndex = tasks.findIndex((t) => t.id === task.id);

    if (existingIndex >= 0) {
      tasks[existingIndex] = {
        ...task,
        updatedAt: new Date(),
      };
    } else {
      tasks.push({
        ...task,
        createdAt: new Date(),
      });
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }

  static get(id: string): AutoMLTask | null {
    const tasks = this.getAll();
    return tasks.find((t) => t.id === id) || null;
  }

  static getAll(): AutoMLTask[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      const tasks = JSON.parse(stored);
      return tasks.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
      }));
    } catch {
      return [];
    }
  }

  static delete(id: string): boolean {
    const tasks = this.getAll();
    const filtered = tasks.filter((t) => t.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return filtered.length < tasks.length;
  }

  static updateStatus(id: string, status: AutoMLTask["status"]): void {
    const task = this.get(id);
    if (task) {
      task.status = status;
      this.save(task);
    }
  }

  static addModel(taskId: string, model: AutoMLModel): void {
    const task = this.get(taskId);
    if (task) {
      if (!task.models) {
        task.models = [];
      }
      task.models.push(model);
      this.save(task);
    }
  }

  static updateMetrics(taskId: string, metrics: Record<string, number>): void {
    const task = this.get(taskId);
    if (task) {
      task.metrics = metrics;
      this.save(task);
    }
  }
}

