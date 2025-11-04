export interface ExecutionContext {
  nodeId: string;
  input: any;
  output: any;
  metadata: {
    timestamp: Date;
    duration: number;
    status: "success" | "error" | "pending";
    error?: string;
  };
}

export interface WorkflowContext {
  workflowId: string;
  executionId: string;
  startTime: Date;
  nodes: Map<string, ExecutionContext>;
  globalData: Record<string, any>;
  variables: Record<string, any>;
}

export class ContextManager {
  private context: WorkflowContext;

  constructor(workflowId: string, executionId: string) {
    this.context = {
      workflowId,
      executionId,
      startTime: new Date(),
      nodes: new Map(),
      globalData: {},
      variables: {},
    };
  }

  getContext(): WorkflowContext {
    return this.context;
  }

  setNodeContext(nodeId: string, context: ExecutionContext): void {
    this.context.nodes.set(nodeId, context);
  }

  getNodeContext(nodeId: string): ExecutionContext | undefined {
    return this.context.nodes.get(nodeId);
  }

  getNodeOutput(nodeId: string): any {
    const nodeContext = this.context.nodes.get(nodeId);
    return nodeContext?.output;
  }

  setGlobalData(key: string, value: any): void {
    this.context.globalData[key] = value;
  }

  getGlobalData(key: string): any {
    return this.context.globalData[key];
  }

  setVariable(name: string, value: any): void {
    this.context.variables[name] = value;
  }

  getVariable(name: string): any {
    return this.context.variables[name];
  }

  getAllVariables(): Record<string, any> {
    return { ...this.context.variables };
  }

  getExecutionTime(): number {
    return Date.now() - this.context.startTime.getTime();
  }

  getNodeExecutionOrder(connections: Array<{ source: string; target: string }>): string[] {
    const nodeIds = Array.from(this.context.nodes.keys());
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    // Initialize graph and in-degree
    nodeIds.forEach((nodeId) => {
      graph.set(nodeId, []);
      inDegree.set(nodeId, 0);
    });

    // Build graph
    connections.forEach((conn) => {
      const neighbors = graph.get(conn.source) || [];
      neighbors.push(conn.target);
      graph.set(conn.source, neighbors);
      inDegree.set(conn.target, (inDegree.get(conn.target) || 0) + 1);
    });

    // Topological sort
    const queue: string[] = [];
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    const result: string[] = [];
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      result.push(nodeId);

      const neighbors = graph.get(nodeId) || [];
      neighbors.forEach((neighbor) => {
        inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      });
    }

    return result;
  }

  clear(): void {
    this.context.nodes.clear();
    this.context.globalData = {};
    this.context.variables = {};
  }
}

