export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: any[];
  connections: any[];
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export class WorkflowService {
  private static STORAGE_KEY = "laboratory2-workflows";

  static save(workflow: Workflow): void {
    const workflows = this.getAll();
    const existingIndex = workflows.findIndex((w) => w.id === workflow.id);

    if (existingIndex >= 0) {
      workflows[existingIndex] = {
        ...workflow,
        updatedAt: new Date(),
      };
    } else {
      workflows.push({
        ...workflow,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(workflows));
  }

  static get(id: string): Workflow | null {
    const workflows = this.getAll();
    return workflows.find((w) => w.id === id) || null;
  }

  static getAll(): Workflow[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      const workflows = JSON.parse(stored);
      return workflows.map((w: any) => ({
        ...w,
        createdAt: new Date(w.createdAt),
        updatedAt: new Date(w.updatedAt),
      }));
    } catch {
      return [];
    }
  }

  static delete(id: string): boolean {
    const workflows = this.getAll();
    const filtered = workflows.filter((w) => w.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return filtered.length < workflows.length;
  }

  static export(workflow: Workflow): string {
    return JSON.stringify(workflow, null, 2);
  }

  static import(json: string): Workflow | null {
    try {
      const workflow = JSON.parse(json);
      if (!workflow.id || !workflow.name || !workflow.nodes || !workflow.connections) {
        throw new Error("Invalid workflow format");
      }
      // Generate new ID to avoid conflicts
      workflow.id = `workflow-${Date.now()}`;
      this.save(workflow);
      return workflow;
    } catch (error) {
      console.error("Failed to import workflow:", error);
      return null;
    }
  }

  static duplicate(workflowId: string): Workflow | null {
    const workflow = this.get(workflowId);
    if (!workflow) return null;

    const duplicated: Workflow = {
      ...workflow,
      id: `workflow-${Date.now()}`,
      name: `${workflow.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.save(duplicated);
    return duplicated;
  }
}

