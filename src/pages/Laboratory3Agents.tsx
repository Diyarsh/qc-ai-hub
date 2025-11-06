import { useState } from "react";
import { Zap } from "lucide-react";
import { WorkflowCanvas } from "@/modules/laboratory3/agents/components/WorkflowCanvas";
import { NodePalette } from "@/modules/laboratory3/agents/components/NodePalette";
import { ContextualRightPanel } from "@/modules/laboratory3/agents/components/ContextualRightPanel";
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

export function Laboratory3Agents() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<any | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [connecting, setConnecting] = useState<{ source: string | null; target: string | null; mousePos?: { x: number; y: number } }>({ source: null, target: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<any[]>([]);
  const [executingNode, setExecutingNode] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNextSteps, setShowNextSteps] = useState<string | null>(null); // nodeId for which to show next steps

  const handleDragStart = (nodeType: any) => {
    setDraggedNode(nodeType);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !draggedNode) {
      setIsDragging(true);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (connecting.source) {
      const rect = e.currentTarget.getBoundingClientRect();
      setConnecting(prev => ({
        ...prev,
        mousePos: { x: e.clientX - rect.left, y: e.clientY - rect.top }
      }));
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    if (connecting.source && !connecting.target) {
      setConnecting({ source: null, target: null });
    }
    
    if (draggedNode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      
      if (x > 0 && y > 0) {
        const newNode: Node = {
          id: `node-${Date.now()}`,
          type: draggedNode.type,
          position: { x, y },
          data: {
            label: draggedNode.label,
            icon: draggedNode.icon,
            color: draggedNode.color,
            description: draggedNode.description,
            config: draggedNode.config || {},
          }
        };
        setNodes([...nodes, newNode]);
      }
    }
    setDraggedNode(null);
    setIsDragging(false);
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    setError(null);
  };

  const handleNodeDrag = (nodeId: string, position: { x: number; y: number }) => {
    setNodes(nodes.map(n => 
      n.id === nodeId ? { ...n, position } : n
    ));
  };

  const handleStartConnection = (nodeId: string, handle: string) => {
    if (handle === "output") {
      setConnecting({ source: nodeId, target: null });
    }
  };

  const handleEndConnection = (nodeId: string, handle: string) => {
    if (handle === "input" && connecting.source && connecting.source !== nodeId) {
      const exists = connections.some(c => c.source === connecting.source && c.target === nodeId);
      if (!exists) {
        setConnections([...connections, {
          id: `conn-${Date.now()}`,
          source: connecting.source!,
          target: nodeId
        }]);
      }
    }
    setConnecting({ source: null, target: null });
  };

  const handleUpdateNode = (nodeId: string, updates: Partial<Node>) => {
    setNodes(nodes.map(n => 
      n.id === nodeId ? { ...n, ...updates } : n
    ));
  };

  const handleDeleteNode = () => {
    if (selectedNode) {
      setNodes(nodes.filter(n => n.id !== selectedNode));
      setConnections(connections.filter(c => c.source !== selectedNode && c.target !== selectedNode));
      setSelectedNode(null);
    }
  };

  const handleDeleteConnection = (connectionId: string) => {
    setConnections(connections.filter(c => c.id !== connectionId));
  };

  const handleAddNodeFromRecommendation = (nodeType: any) => {
    const sourceNodeId = showNextSteps || selectedNode;
    const sourceNode = nodes.find(n => n.id === sourceNodeId);
    const centerX = sourceNode ? sourceNode.position.x + 250 : 400;
    const centerY = sourceNode ? sourceNode.position.y : 300;
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: nodeType.type,
      position: { x: centerX, y: centerY },
      data: {
        label: nodeType.label,
        icon: nodeType.icon,
        color: nodeType.color,
        description: nodeType.description,
        config: nodeType.config || {},
      }
    };
    setNodes([...nodes, newNode]);
    
    // Auto-connect if there's a source node
    if (sourceNodeId && nodeType.type !== "trigger") {
      setConnections([...connections, {
        id: `conn-${Date.now()}`,
        source: sourceNodeId,
        target: newNode.id
      }]);
    }
    
    // Close next steps panel
    setShowNextSteps(null);
    setSelectedNode(null);
  };

  const handleAddNodeClick = (nodeId: string) => {
    setShowNextSteps(nodeId);
    setSelectedNode(null);
  };

  const handleTriggerSelect = (trigger: any) => {
    // Create "When clicking 'Execute workflow'" node for manual trigger
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: "trigger",
      position: { x: 400, y: 300 },
      data: {
        label: "When clicking 'Execute workflow'",
        icon: Zap,
        color: "bg-green-500",
        description: "Manual execution trigger",
        config: { triggerType: trigger.id },
      }
    };
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode.id);
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);
  const isEmpty = nodes.length === 0;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Collapsed or hidden when empty */}
        {!isEmpty && (
          <NodePalette
            nodeTypes={nodeTypesLibrary}
            onDragStart={handleDragStart}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          <WorkflowCanvas
            nodes={nodes}
            connections={connections}
            zoom={zoom}
            pan={pan}
            selectedNode={selectedNode}
            isDragging={isDragging}
            connecting={connecting}
            onNodeClick={handleNodeClick}
            onNodeDrag={handleNodeDrag}
            onStartConnection={handleStartConnection}
            onEndConnection={handleEndConnection}
            onCanvasPan={setPan}
            onCanvasMouseDown={handleCanvasMouseDown}
            onCanvasMouseMove={handleCanvasMouseMove}
            onCanvasMouseUp={handleCanvasMouseUp}
            debugMode={debugMode}
            executingNode={executingNode}
            isEmpty={isEmpty}
            onAddNodeClick={handleAddNodeClick}
          />
        </div>

        {/* Right Panel - Contextual */}
        <ContextualRightPanel
          isEmpty={isEmpty}
          selectedNode={selectedNodeData}
          nodes={nodes}
          connections={connections}
          isExecuting={isExecuting}
          executionLogs={executionLogs}
          error={error}
          showNextSteps={showNextSteps}
          onClose={() => {
            setSelectedNode(null);
            setShowNextSteps(null);
          }}
          onUpdate={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          onDeleteConnection={handleDeleteConnection}
          onAddNode={handleAddNodeFromRecommendation}
          onTriggerSelect={handleTriggerSelect}
          onClearLogs={() => {
            setExecutionLogs([]);
            setIsExecuting(false);
          }}
          onStopExecution={() => {
            setIsExecuting(false);
            setExecutingNode(null);
          }}
        />
      </div>
    </div>
  );
}
