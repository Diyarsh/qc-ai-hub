import { NodeProperties } from "@/modules/laboratory2/agents/components/NodeProperties";
import { ExecutionPanel, ExecutionLog } from "@/modules/laboratory2/agents/components/ExecutionPanel";
import { WorkflowStarterPanel } from "./WorkflowStarterPanel";
import { NextStepsPanel } from "./NextStepsPanel";
import { WhatNextPanel } from "./WhatNextPanel";
import { ErrorPanel } from "./ErrorPanel";
import { nodeTypesLibrary } from "@/modules/laboratory2/agents/nodes/nodeTypes";

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

interface ContextualRightPanelProps {
  isEmpty: boolean;
  selectedNode: Node | null | undefined;
  nodes: Node[];
  connections: Connection[];
  isExecuting: boolean;
  executionLogs: ExecutionLog[];
  error: string | null;
  showNextSteps?: string | null; // nodeId for which to show next steps
  onClose: () => void;
  onUpdate: (nodeId: string, updates: Partial<Node>) => void;
  onDeleteNode: () => void;
  onDeleteConnection: (connectionId: string) => void;
  onAddNode: (nodeType: any) => void;
  onTriggerSelect?: (trigger: any) => void;
  onClearLogs?: () => void;
  onStopExecution?: () => void;
}

export function ContextualRightPanel({
  isEmpty,
  selectedNode,
  nodes,
  connections,
  isExecuting,
  executionLogs,
  error,
  showNextSteps,
  onClose,
  onUpdate,
  onDeleteNode,
  onDeleteConnection,
  onAddNode,
  onTriggerSelect,
  onClearLogs,
  onStopExecution,
}: ContextualRightPanelProps) {
  // Determine which panel to show based on state
  // Priority: error > executing > showNextSteps > selectedNode > isEmpty
  
  if (error) {
    return (
      <ErrorPanel
        error={error}
        onClose={onClose}
        onAddNode={onAddNode}
      />
    );
  }

  if (isExecuting || executionLogs.length > 0) {
    return (
      <ExecutionPanel
        logs={executionLogs}
        isExecuting={isExecuting}
        onClear={onClearLogs || (() => {})}
        onStop={onStopExecution}
      />
    );
  }

  // Show NextStepsPanel when "+" button is clicked
  if (showNextSteps) {
    return (
      <NextStepsPanel
        onSelectCategory={(category) => {
          // Find first matching node from nodeTypesLibrary based on category
          const matchingNode = nodeTypesLibrary.find((nt) =>
            category.nodeTypes.includes(nt.type)
          );
          
          if (matchingNode) {
            onAddNode(matchingNode);
          } else {
            // Fallback: add a placeholder node
            onAddNode({
              type: category.nodeTypes[0] || "tool",
              label: category.label,
              description: category.description,
              icon: category.icon,
              color: "bg-blue-500",
              config: {},
            });
          }
        }}
        onSelectNodeType={(nodeType) => {
          const matchingNode = nodeTypesLibrary.find((nt) => nt.type === nodeType);
          if (matchingNode) {
            onAddNode(matchingNode);
          }
        }}
      />
    );
  }

  if (selectedNode) {
    return (
      <NodeProperties
        node={selectedNode}
        connections={connections}
        allNodes={nodes}
        onUpdate={onUpdate}
        onClose={onClose}
        onDeleteConnection={onDeleteConnection}
      />
    );
  }

  if (isEmpty) {
    return (
      <WorkflowStarterPanel
        onSelectTrigger={(trigger) => {
          // Use onTriggerSelect if provided (for "When clicking 'Execute workflow'" node)
          if (onTriggerSelect) {
            onTriggerSelect(trigger);
          } else {
            // Fallback: add trigger node directly
            onAddNode({
              type: "trigger",
              label: trigger.label,
              description: trigger.description,
              icon: trigger.icon,
              color: "bg-green-500",
              config: { triggerType: trigger.id },
            });
          }
        }}
      />
    );
  }

  // Default: show What's Next panel
  return (
    <WhatNextPanel
      currentNode={null}
      nodes={nodes}
      connections={connections}
      onAddNode={onAddNode}
    />
  );
}
