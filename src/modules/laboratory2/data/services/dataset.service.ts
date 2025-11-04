import { Dataset } from "../components/DatasetManager";

export class DatasetService {
  private static STORAGE_KEY = "laboratory2-datasets";

  static save(dataset: Dataset): void {
    const datasets = this.getAll();
    const existingIndex = datasets.findIndex((d) => d.id === dataset.id);

    if (existingIndex >= 0) {
      datasets[existingIndex] = {
        ...dataset,
        updatedAt: new Date(),
      };
    } else {
      datasets.push({
        ...dataset,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(datasets));
  }

  static get(id: string): Dataset | null {
    const datasets = this.getAll();
    return datasets.find((d) => d.id === id) || null;
  }

  static getAll(): Dataset[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      const datasets = JSON.parse(stored);
      return datasets.map((d: any) => ({
        ...d,
        createdAt: new Date(d.createdAt),
        updatedAt: new Date(d.updatedAt),
      }));
    } catch {
      return [];
    }
  }

  static delete(id: string): boolean {
    const datasets = this.getAll();
    const filtered = datasets.filter((d) => d.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return filtered.length < datasets.length;
  }
}

