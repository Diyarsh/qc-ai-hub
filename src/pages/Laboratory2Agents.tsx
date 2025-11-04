import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Save, 
  Download,
  Upload,
  RotateCcw,
  RotateCw,
  ZoomIn, 
  ZoomOut,
  Loader2,
  FileText
} from "lucide-react";
import { WorkflowCanvas } from "@/modules/laboratory2/agents/components/WorkflowCanvas";
import { NodePalette, NodeType } from "@/modules/laboratory2/agents/components/NodePalette";
import { NodeProperties } from "@/modules/laboratory2/agents/components/NodeProperties";
import { ExecutionPanel, ExecutionLog } from "@/modules/laboratory2/agents/components/ExecutionPanel";
import { TemplateGallery, WorkflowTemplate } from "@/modules/laboratory2/agents/components/TemplateGallery";
import { nodeTypesLibrary } from "@/modules/laboratory2/agents/nodes/nodeTypes";
import { WorkflowExecutor } from "@/modules/laboratory2/agents/engine/WorkflowExecutor";
import { WorkflowService } from "@/modules/laboratory2/agents/services/workflow.service";
import { useToast } from "@/shared/components/Toast";

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

export function Laboratory2Agents() {
  const { showToast } = useToast();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<NodeType | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [connecting, setConnecting] = useState<{ source: string | null; target: string | null; mousePos?: { x: number; y: number } }>({ source: null, target: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [executingNode, setExecutingNode] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleDragStart = (nodeType: NodeType) => {
    setDraggedNode(nodeType);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !draggedNode) {
      setIsDragging(true);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (connecting.source) {
      // Update mouse position for connection line
      const rect = e.currentTarget.getBoundingClientRect();
      setConnecting(prev => ({
        ...prev,
        mousePos: { x: e.clientX - rect.left, y: e.clientY - rect.top }
      }));
    } else if (isDragging && !draggedNode) {
      // Pan logic
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    // If connecting, cancel connection if not dropped on input
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

  const handleNodeDrag = (nodeId: string, position: { x: number; y: number }) => {
    setNodes(nodes.map(n => 
      n.id === nodeId ? { ...n, position } : n
    ));
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
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

  const handleUpdateNode = (nodeId: string, updates: Partial<Node>) => {
    setNodes(nodes.map(n => 
      n.id === nodeId ? { ...n, ...updates } : n
    ));
  };

  const handleToggleBreakpoint = (nodeId: string) => {
    setNodes(nodes.map(n => 
      n.id === nodeId ? { ...n, data: { ...n.data, breakpoint: !n.data.breakpoint } } : n
    ));
  };

  const handleSave = () => {
    const workflow = {
      id: `workflow-${Date.now()}`,
      name: workflowName,
      nodes,
      connections,
    };
    WorkflowService.save(workflow as any);
    showToast('Workflow saved successfully', 'success');
  };

  const handleExecute = async () => {
    if (nodes.length === 0) {
      showToast('No nodes to execute', 'error');
      return;
    }

    setIsExecuting(true);
    setExecutionLogs([]);
    setExecutingNode(null);

    const executor = new WorkflowExecutor('workflow-1', `exec-${Date.now()}`);
    
    const result = await executor.execute(
      nodes as any,
      connections,
      {
        debugMode,
        breakpoints: new Set(nodes.filter(n => n.data.breakpoint).map(n => n.id)),
        onStep: (nodeId, context) => {
          setExecutingNode(nodeId);
        },
        onLog: (log) => {
          setExecutionLogs(prev => [...prev, log]);
        }
      }
    );

    setIsExecuting(false);
    setExecutingNode(null);
    
    if (result.success) {
      showToast('Workflow executed successfully', 'success');
    } else {
      showToast('Workflow execution failed', 'error');
    }
  };

  const handleSelectTemplate = (template: WorkflowTemplate) => {
    setNodes(template.nodes as Node[]);
    setConnections(template.connections);
    setWorkflowName(template.name);
    showToast(`Template "${template.name}" loaded`, 'success');
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex overflow-hidden">
        <NodePalette
          nodeTypes={nodeTypesLibrary}
          onDragStart={handleDragStart}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="flex-1 relative overflow-hidden bg-muted/20">
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
          />
        </div>

        {selectedNode && selectedNodeData && (
          <NodeProperties
            node={selectedNodeData}
            connections={connections}
            allNodes={nodes}
            onUpdate={handleUpdateNode}
            onClose={() => setSelectedNode(null)}
            onDeleteConnection={handleDeleteConnection}
            onToggleBreakpoint={handleToggleBreakpoint}
          />
        )}

        {(isExecuting || executionLogs.length > 0) && (
          <ExecutionPanel
            logs={executionLogs}
            isExecuting={isExecuting}
            onClear={() => {
              setExecutionLogs([]);
              setIsExecuting(false);
            }}
            onStop={() => {
              setIsExecuting(false);
              setExecutingNode(null);
            }}
          />
        )}
      </div>

      <div className="border-t border-border bg-card p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="h-8 w-48 text-sm"
            placeholder="Workflow name"
          />
          <Button variant="outline" size="sm" onClick={() => setShowTemplates(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetZoom}>
            {Math.round(zoom * 100)}%
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDebugMode(!debugMode)}>
            {debugMode ? "Debug: ON" : "Debug: OFF"}
          </Button>
          <Button size="sm" onClick={handleExecute} disabled={isExecuting}>
            {isExecuting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Execute
              </>
            )}
          </Button>
        </div>
      </div>

      {showTemplates && (
        <TemplateGallery
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
}

