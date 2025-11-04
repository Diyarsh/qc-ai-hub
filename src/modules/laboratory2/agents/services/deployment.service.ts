export interface Deployment {
  id: string;
  workflowId: string;
  type: "rest" | "chat-widget" | "slack-bot" | "portal-button";
  config: Record<string, any>;
  status: "active" | "inactive" | "error";
  createdAt: Date;
  updatedAt: Date;
}

export interface DeploymentPlan {
  id: string;
  name: string;
  resources: {
    cpu: string;
    memory: string;
    storage: string;
  };
  quotas: {
    requestsPerMinute: number;
    requestsPerDay: number;
    storageGB: number;
  };
  price?: number;
}

export class DeploymentService {
  private static STORAGE_KEY = "laboratory2-deployments";
  private static PLANS_KEY = "laboratory2-deployment-plans";

  static getDeploymentPlans(): DeploymentPlan[] {
    return [
      {
        id: "free",
        name: "Free",
        resources: {
          cpu: "0.5 cores",
          memory: "512MB",
          storage: "1GB",
        },
        quotas: {
          requestsPerMinute: 10,
          requestsPerDay: 1000,
          storageGB: 1,
        },
        price: 0,
      },
      {
        id: "starter",
        name: "Starter",
        resources: {
          cpu: "1 core",
          memory: "1GB",
          storage: "5GB",
        },
        quotas: {
          requestsPerMinute: 60,
          requestsPerDay: 10000,
          storageGB: 5,
        },
        price: 29,
      },
      {
        id: "professional",
        name: "Professional",
        resources: {
          cpu: "2 cores",
          memory: "2GB",
          storage: "20GB",
        },
        quotas: {
          requestsPerMinute: 300,
          requestsPerDay: 100000,
          storageGB: 20,
        },
        price: 99,
      },
      {
        id: "enterprise",
        name: "Enterprise",
        resources: {
          cpu: "4+ cores",
          memory: "4GB+",
          storage: "100GB+",
        },
        quotas: {
          requestsPerMinute: 1000,
          requestsPerDay: 1000000,
          storageGB: 100,
        },
      },
    ];
  }

  static deploy(
    workflowId: string,
    type: Deployment["type"],
    config: Record<string, any>,
    planId: string = "free"
  ): Deployment {
    const deployment: Deployment = {
      id: `deployment-${Date.now()}`,
      workflowId,
      type,
      config: {
        ...config,
        planId,
      },
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.saveDeployment(deployment);
    return deployment;
  }

  static saveDeployment(deployment: Deployment): void {
    const deployments = this.getAllDeployments();
    const existingIndex = deployments.findIndex((d) => d.id === deployment.id);

    if (existingIndex >= 0) {
      deployments[existingIndex] = {
        ...deployment,
        updatedAt: new Date(),
      };
    } else {
      deployments.push(deployment);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(deployments));
  }

  static getAllDeployments(): Deployment[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      const deployments = JSON.parse(stored);
      return deployments.map((d: any) => ({
        ...d,
        createdAt: new Date(d.createdAt),
        updatedAt: new Date(d.updatedAt),
      }));
    } catch {
      return [];
    }
  }

  static getDeployment(id: string): Deployment | null {
    const deployments = this.getAllDeployments();
    return deployments.find((d) => d.id === id) || null;
  }

  static getDeploymentsByWorkflow(workflowId: string): Deployment[] {
    const deployments = this.getAllDeployments();
    return deployments.filter((d) => d.workflowId === workflowId);
  }

  static stopDeployment(id: string): boolean {
    const deployment = this.getDeployment(id);
    if (!deployment) return false;

    deployment.status = "inactive";
    deployment.updatedAt = new Date();
    this.saveDeployment(deployment);
    return true;
  }

  static deleteDeployment(id: string): boolean {
    const deployments = this.getAllDeployments();
    const filtered = deployments.filter((d) => d.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return filtered.length < deployments.length;
  }

  static generateEndpointUrl(deployment: Deployment): string {
    const baseUrl = window.location.origin;
    switch (deployment.type) {
      case "rest":
        return `${baseUrl}/api/workflows/${deployment.workflowId}`;
      case "chat-widget":
        return `${baseUrl}/widgets/${deployment.id}`;
      case "slack-bot":
        return `${baseUrl}/slack/${deployment.id}`;
      case "portal-button":
        return `${baseUrl}/portal/button/${deployment.id}`;
      default:
        return "";
    }
  }
}

