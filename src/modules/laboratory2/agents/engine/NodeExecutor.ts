import { ContextManager, ExecutionContext } from "./ContextManager";
import { sendChatMessage } from "@/shared/services/ai.service";

export interface Node {
  id: string;
  type: string;
  data: {
    label: string;
    config?: Record<string, any>;
    [key: string]: any;
  };
}

export interface Connection {
  source: string;
  target: string;
}

export class NodeExecutor {
  constructor(private contextManager: ContextManager) {}

  async executeNode(
    node: Node,
    input: any,
    connections: Connection[]
  ): Promise<any> {
    const startTime = Date.now();
    let output: any;
    let status: "success" | "error" | "pending" = "pending";
    let error: string | undefined;

    try {
      switch (node.type) {
        case "trigger":
          output = await this.executeTrigger(node, input);
          break;
        case "llm":
          output = await this.executeLLM(node, input);
          break;
        case "knowledge":
          output = await this.executeKnowledge(node, input);
          break;
        case "tool":
          output = await this.executeTool(node, input);
          break;
        case "memory":
          output = await this.executeMemory(node, input);
          break;
        case "guardrail":
          output = await this.executeGuardrail(node, input);
          break;
        case "eval":
          output = await this.executeEval(node, input);
          break;
        case "action":
          output = await this.executeAction(node, input);
          break;
        default:
          throw new Error(`Unknown node type: ${node.type}`);
      }

      status = "success";
    } catch (err: any) {
      status = "error";
      error = err.message || "Unknown error";
      output = { error: error };
    }

    const duration = Date.now() - startTime;
    const context: ExecutionContext = {
      nodeId: node.id,
      input,
      output,
      metadata: {
        timestamp: new Date(),
        duration,
        status,
        error,
      },
    };

    this.contextManager.setNodeContext(node.id, context);
    return output;
  }

  private async executeTrigger(node: Node, input: any): Promise<any> {
    const config = node.data.config || {};
    const triggerType = node.data.label.toLowerCase();

    switch (triggerType) {
      case "schedule":
        return {
          triggered: true,
          timestamp: new Date().toISOString(),
          scheduleType: config.scheduleType || "cron",
        };
      case "webhook":
        return {
          triggered: true,
          method: config.method || "POST",
          path: config.path || "/webhook",
          data: input,
        };
      case "manual":
        return {
          triggered: true,
          timestamp: new Date().toISOString(),
          user: "current_user",
        };
      case "event":
        return {
          triggered: true,
          eventType: config.eventType || "slack",
          data: input,
        };
      default:
        return { triggered: true, data: input };
    }
  }

  private async executeLLM(node: Node, input: any): Promise<any> {
    const config = node.data.config || {};
    const nodeLabel = node.data.label.toLowerCase();

    if (nodeLabel.includes("llm node")) {
      const messages = Array.isArray(input.messages)
        ? input.messages
        : [{ role: "user", content: JSON.stringify(input) }];

      const response = await sendChatMessage(messages, {
        model: config.model || "gpt-3.5-turbo",
        temperature: config.temperature || 0.7,
        maxTokens: config.maxTokens || 1000,
        systemPrompt: config.systemPrompt || "",
      });

      return {
        content: response.content,
        model: response.model,
        usage: response.usage,
      };
    }

    if (nodeLabel.includes("chat builder")) {
      return {
        messages: input.messages || [],
        examples: config.examples || [],
      };
    }

    if (nodeLabel.includes("system prompt")) {
      return {
        prompt: config.prompt || "",
        variables: config.variables || [],
      };
    }

    if (nodeLabel.includes("function calling")) {
      return {
        functions: config.functions || [],
        tools: input.tools || [],
      };
    }

    return input;
  }

  private async executeKnowledge(node: Node, input: any): Promise<any> {
    const config = node.data.config || {};
    const nodeLabel = node.data.label.toLowerCase();

    if (nodeLabel.includes("rag search")) {
      return {
        query: input.query || input.text || "",
        results: [
          {
            text: "Sample result from knowledge base",
            score: 0.95,
            source: "document1.pdf",
          },
        ],
        topK: config.topK || 5,
      };
    }

    if (nodeLabel.includes("rag index")) {
      return {
        indexed: true,
        chunks: 10,
        embeddingModel: config.embeddingModel || "text-embedding-ada-002",
      };
    }

    if (nodeLabel.includes("document loader")) {
      return {
        loaded: true,
        format: config.format || "pdf",
        pages: 5,
        chunks: 10,
      };
    }

    if (nodeLabel.includes("knowledge index")) {
      return {
        indexed: true,
        source: config.source || "s3",
        documents: 100,
      };
    }

    return input;
  }

  private async executeTool(node: Node, input: any): Promise<any> {
    const config = node.data.config || {};
    const nodeLabel = node.data.label.toLowerCase();

    if (nodeLabel.includes("http request")) {
      // Simulate HTTP request
      return {
        status: 200,
        data: { message: "HTTP request successful", input },
        headers: {},
      };
    }

    if (nodeLabel.includes("sql query")) {
      return {
        rows: [
          { id: 1, name: "Sample", value: 100 },
          { id: 2, name: "Data", value: 200 },
        ],
        count: 2,
      };
    }

    if (nodeLabel.includes("python script")) {
      return {
        result: "Python script executed",
        output: input,
      };
    }

    if (nodeLabel.includes("ocr")) {
      return {
        text: "Extracted text from image",
        confidence: 0.95,
      };
    }

    return input;
  }

  private async executeMemory(node: Node, input: any): Promise<any> {
    const config = node.data.config || {};
    const nodeLabel = node.data.label.toLowerCase();

    if (nodeLabel.includes("short-term")) {
      return {
        stored: true,
        key: input.key || "default",
        value: input.value || input,
        ttl: config.ttl || 3600,
      };
    }

    if (nodeLabel.includes("long-term")) {
      return {
        stored: true,
        key: input.key || "default",
        value: input.value || input,
        persistent: true,
      };
    }

    return input;
  }

  private async executeGuardrail(node: Node, input: any): Promise<any> {
    const config = node.data.config || {};
    const nodeLabel = node.data.label.toLowerCase();

    if (nodeLabel.includes("pii detection")) {
      return {
        detected: false,
        entities: [],
        masked: input,
      };
    }

    if (nodeLabel.includes("content moderation")) {
      return {
        moderated: true,
        safe: true,
        categories: [],
      };
    }

    if (nodeLabel.includes("rate limiting")) {
      return {
        allowed: true,
        remaining: config.maxRequests || 100,
      };
    }

    return input;
  }

  private async executeEval(node: Node, input: any): Promise<any> {
    const config = node.data.config || {};
    return {
      logged: true,
      level: config.level || "info",
      data: input,
    };
  }

  private async executeAction(node: Node, input: any): Promise<any> {
    const config = node.data.config || {};
    return {
      executed: true,
      action: node.data.label,
      result: input,
    };
  }
}

