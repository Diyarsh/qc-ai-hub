import { ContextManager } from "./ContextManager";
import { NodeExecutor, Node, Connection } from "./NodeExecutor";

export interface ExecutionLog {
  id: string;
  timestamp: Date;
  level: "info" | "success" | "error" | "warning";
  message: string;
  nodeId?: string;
  nodeName?: string;
  data?: any;
}

export interface ExecutionOptions {
  debugMode?: boolean;
  breakpoints?: Set<string>;
  stepMode?: boolean;
  onStep?: (nodeId: string, context: any) => void;
  onLog?: (log: ExecutionLog) => void;
}

export class WorkflowExecutor {
  private contextManager: ContextManager;
  private nodeExecutor: NodeExecutor;
  private logs: ExecutionLog[] = [];
  private isExecuting: boolean = false;
  private shouldStop: boolean = false;

  constructor(workflowId: string, executionId: string) {
    this.contextManager = new ContextManager(workflowId, executionId);
    this.nodeExecutor = new NodeExecutor(this.contextManager);
  }

  async execute(
    nodes: Node[],
    connections: Connection[],
    options: ExecutionOptions = {}
  ): Promise<{ success: boolean; output: any; logs: ExecutionLog[] }> {
    this.isExecuting = true;
    this.shouldStop = false;
    this.logs = [];

    try {
      this.addLog("info", "Starting workflow execution", undefined, undefined, {
        nodeCount: nodes.length,
        connectionCount: connections.length,
      });

      // Find trigger nodes (nodes with no incoming connections)
      const incomingConnections = new Set(
        connections.map((c) => c.target)
      );
      const triggerNodes = nodes.filter(
        (n) => !incomingConnections.has(n.id)
      );

      if (triggerNodes.length === 0) {
        throw new Error("No trigger nodes found in workflow");
      }

      this.addLog(
        "info",
        `Found ${triggerNodes.length} trigger node(s)`,
        undefined,
        undefined,
        { triggers: triggerNodes.map((n) => n.data.label) }
      );

      // Execute workflow starting from trigger nodes
      const results: any[] = [];
      for (const triggerNode of triggerNodes) {
        if (this.shouldStop) {
          this.addLog("warning", "Execution stopped by user");
          break;
        }

        const result = await this.executeFromNode(
          triggerNode,
          nodes,
          connections,
          options
        );
        results.push(result);
      }

      const output = results.length === 1 ? results[0] : results;
      this.addLog("success", "Workflow execution completed", undefined, undefined, {
        output,
      });

      return {
        success: true,
        output,
        logs: this.logs,
      };
    } catch (error: any) {
      this.addLog(
        "error",
        `Workflow execution failed: ${error.message}`,
        undefined,
        undefined,
        { error: error.toString() }
      );
      return {
        success: false,
        output: null,
        logs: this.logs,
      };
    } finally {
      this.isExecuting = false;
    }
  }

  private async executeFromNode(
    startNode: Node,
    allNodes: Node[],
    connections: Connection[],
    options: ExecutionOptions
  ): Promise<any> {
    const visited = new Set<string>();
    const executionQueue: Array<{ node: Node; input: any }> = [
      { node: startNode, input: {} },
    ];

    while (executionQueue.length > 0 && !this.shouldStop) {
      const { node, input } = executionQueue.shift()!;

      if (visited.has(node.id)) {
        continue;
      }

      // Check breakpoint
      if (options.breakpoints?.has(node.id)) {
        this.addLog(
          "info",
          `Breakpoint hit at node: ${node.data.label}`,
          node.id,
          node.data.label
        );
        if (options.onStep) {
          options.onStep(node.id, this.contextManager.getNodeContext(node.id));
        }
        // Wait for continue in step mode
        if (options.stepMode) {
          await this.waitForContinue();
        }
      }

      visited.add(node.id);

      this.addLog(
        "info",
        `Executing node: ${node.data.label}`,
        node.id,
        node.data.label
      );

      // Get input from previous nodes
      const nodeInput = this.getNodeInput(node.id, connections, allNodes);

      // Execute node
      const nodeOutput = await this.nodeExecutor.executeNode(
        node,
        nodeInput,
        connections
      );

      const nodeContext = this.contextManager.getNodeContext(node.id);
      if (nodeContext?.metadata.status === "error") {
        this.addLog(
          "error",
          `Node execution failed: ${nodeContext.metadata.error}`,
          node.id,
          node.data.label
        );
        if (!options.debugMode) {
          throw new Error(
            `Node ${node.data.label} failed: ${nodeContext.metadata.error}`
          );
        }
      } else {
        this.addLog(
          "success",
          `Node executed successfully: ${node.data.label}`,
          node.id,
          node.data.label,
          { output: nodeOutput }
        );
      }

      if (options.onStep) {
        options.onStep(node.id, nodeContext);
      }

      // Find next nodes
      const nextNodes = this.getNextNodes(node.id, connections, allNodes);
      for (const nextNode of nextNodes) {
        if (!visited.has(nextNode.id)) {
          executionQueue.push({ node: nextNode, input: nodeOutput });
        }
      }
    }

    // Get final output from action nodes or last executed node
    const actionNodes = allNodes.filter((n) => n.type === "action");
    if (actionNodes.length > 0) {
      const lastActionNode = actionNodes[actionNodes.length - 1];
      return this.contextManager.getNodeOutput(lastActionNode.id);
    }

    // Return output from last executed node
    const executedNodes = Array.from(visited)
      .map((id) => allNodes.find((n) => n.id === id))
      .filter(Boolean) as Node[];
    if (executedNodes.length > 0) {
      const lastNode = executedNodes[executedNodes.length - 1];
      return this.contextManager.getNodeOutput(lastNode.id);
    }

    return null;
  }

  private getNodeInput(
    nodeId: string,
    connections: Connection[],
    allNodes: Node[]
  ): any {
    const incomingConnections = connections.filter((c) => c.target === nodeId);
    if (incomingConnections.length === 0) {
      return {};
    }

    // If multiple inputs, combine them
    if (incomingConnections.length === 1) {
      const sourceNodeId = incomingConnections[0].source;
      return this.contextManager.getNodeOutput(sourceNodeId) || {};
    }

    // Multiple inputs - combine into object
    const inputs: Record<string, any> = {};
    incomingConnections.forEach((conn) => {
      const sourceOutput = this.contextManager.getNodeOutput(conn.source);
      const sourceNode = allNodes.find((n) => n.id === conn.source);
      const key = sourceNode?.data.label || conn.source;
      inputs[key] = sourceOutput;
    });

    return inputs;
  }

  private getNextNodes(
    nodeId: string,
    connections: Connection[],
    allNodes: Node[]
  ): Node[] {
    const outgoingConnections = connections.filter((c) => c.source === nodeId);
    return outgoingConnections
      .map((conn) => allNodes.find((n) => n.id === conn.target))
      .filter(Boolean) as Node[];
  }

  private addLog(
    level: ExecutionLog["level"],
    message: string,
    nodeId?: string,
    nodeName?: string,
    data?: any
  ): void {
    const log: ExecutionLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      level,
      message,
      nodeId,
      nodeName,
      data,
    };

    this.logs.push(log);
  }

  private waitForContinue(): Promise<void> {
    return new Promise((resolve) => {
      // In a real implementation, this would wait for user interaction
      // For now, we'll just resolve immediately
      setTimeout(resolve, 100);
    });
  }

  stop(): void {
    this.shouldStop = true;
    this.isExecuting = false;
  }

  getLogs(): ExecutionLog[] {
    return this.logs;
  }

  getContext(): ContextManager {
    return this.contextManager;
  }
}

