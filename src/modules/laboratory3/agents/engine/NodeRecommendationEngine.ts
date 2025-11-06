import { nodeTypesLibrary } from "@/modules/laboratory2/agents/nodes/nodeTypes";

interface Node {
  id: string;
  type: string;
  data: {
    label: string;
    icon?: any;
    color?: string;
    config?: Record<string, any>;
    description?: string;
  };
}

interface Connection {
  id: string;
  source: string;
  target: string;
}

interface Recommendation {
  nodeLabel: string;
  reason: string;
  score: number;
}

export class NodeRecommendationEngine {
  // Matrix of node type compatibility
  private compatibilityMatrix: Record<string, string[]> = {
    trigger: ["llm", "tool", "knowledge"],
    llm: ["llm", "memory", "guardrail", "action", "eval"],
    knowledge: ["llm", "eval"],
    tool: ["llm", "memory", "action"],
    memory: ["llm", "action"],
    guardrail: ["llm", "action"],
    eval: ["action"],
  };

  // Popular patterns
  private popularPatterns: Record<string, string[]> = {
    "trigger-llm-action": ["trigger", "llm", "action"],
    "trigger-knowledge-llm": ["trigger", "knowledge", "llm"],
    "trigger-tool-llm": ["trigger", "tool", "llm"],
  };

  getRecommendations(
    currentNode: Node | null,
    allNodes: Node[],
    connections: Connection[]
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    if (!currentNode && allNodes.length === 0) {
      // Empty workflow - suggest triggers
      const triggers = nodeTypesLibrary.filter((nt) => nt.type === "trigger");
      return triggers.slice(0, 3).map((trigger) => ({
        nodeLabel: trigger.label,
        reason: "Start your workflow",
        score: 1.0,
      }));
    }

    if (currentNode) {
      // Get compatible node types
      const compatibleTypes = this.compatibilityMatrix[currentNode.type] || [];
      const compatibleNodes = nodeTypesLibrary.filter((nt) =>
        compatibleTypes.includes(nt.type)
      );

      // Score recommendations
      compatibleNodes.forEach((nodeType) => {
        let score = 0.5;
        let reason = "Compatible with current node";

        // Check if it's a popular combination
        const pattern = `${currentNode.type}-${nodeType.type}`;
        if (this.isPopularPattern(pattern)) {
          score += 0.3;
          reason = "Popular combination";
        }

        // Check if already used (avoid duplicates for now, but could suggest variations)
        const alreadyUsed = allNodes.some((n) => n.type === nodeType.type);
        if (!alreadyUsed) {
          score += 0.2;
        }

        recommendations.push({
          nodeLabel: nodeType.label,
          reason,
          score,
        });
      });
    } else {
      // No current node selected - suggest based on workflow state
      const hasTrigger = allNodes.some((n) => n.type === "trigger");
      if (!hasTrigger) {
        const triggers = nodeTypesLibrary.filter((nt) => nt.type === "trigger");
        recommendations.push({
          nodeLabel: triggers[0]?.label || "",
          reason: "Add a trigger to start",
          score: 1.0,
        });
      } else {
        // Suggest common next steps
        const commonNext = nodeTypesLibrary.filter(
          (nt) => nt.type === "llm" || nt.type === "tool"
        );
        recommendations.push(
          ...commonNext.slice(0, 3).map((node) => ({
            nodeLabel: node.label,
            reason: "Common next step",
            score: 0.7,
          }))
        );
      }
    }

    // Sort by score and return top 5
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .filter((r) => r.nodeLabel);
  }

  private isPopularPattern(pattern: string): boolean {
    return Object.values(this.popularPatterns).some((patternList) => {
      const patternStr = patternList.join("-");
      return patternStr.includes(pattern);
    });
  }
}

