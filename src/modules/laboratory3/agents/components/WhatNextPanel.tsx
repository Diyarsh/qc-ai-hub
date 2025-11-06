import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { nodeTypesLibrary } from "@/modules/laboratory2/agents/nodes/nodeTypes";
import { NodeRecommendationEngine } from "../engine/NodeRecommendationEngine";

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    icon?: any;
    color?: string;
    config?: Record<string, any>;
    description?: string;
    breakpoint?: boolean;
  };
}

interface Connection {
  id: string;
  source: string;
  target: string;
}

interface WhatNextPanelProps {
  currentNode: Node | null;
  nodes: Node[];
  connections: Connection[];
  onAddNode: (nodeType: any) => void;
}

export function WhatNextPanel({
  currentNode,
  nodes,
  connections,
  onAddNode,
}: WhatNextPanelProps) {
  const recommendationEngine = new NodeRecommendationEngine();
  const recommendations = recommendationEngine.getRecommendations(currentNode, nodes, connections);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm">What's Next</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Suggested next steps for your workflow
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {recommendations.map((rec, index) => {
            const nodeType = nodeTypesLibrary.find((nt) => nt.label === rec.nodeLabel);
            if (!nodeType) return null;

            return (
              <Card
                key={index}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => onAddNode(nodeType)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={nodeType.color + " w-8 h-8 rounded flex items-center justify-center text-white shrink-0"}
                    >
                      {nodeType.icon && <nodeType.icon className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm">{nodeType.label}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {nodeType.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                {rec.reason && (
                  <CardContent className="pt-0">
                    <Badge variant="outline" className="text-xs">
                      {rec.reason}
                    </Badge>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

