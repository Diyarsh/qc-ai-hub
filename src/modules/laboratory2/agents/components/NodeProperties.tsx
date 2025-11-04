import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Settings, Code, Link2 } from "lucide-react";

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

interface NodePropertiesProps {
  node: Node | null;
  connections: Connection[];
  allNodes: Node[];
  onUpdate: (nodeId: string, updates: Partial<Node>) => void;
  onClose: () => void;
  onDeleteConnection: (connectionId: string) => void;
  onToggleBreakpoint?: (nodeId: string) => void;
}

export function NodeProperties({
  node,
  connections,
  allNodes,
  onUpdate,
  onClose,
  onDeleteConnection,
  onToggleBreakpoint,
}: NodePropertiesProps) {
  const [localConfig, setLocalConfig] = useState<Record<string, any>>(
    node?.data.config || {}
  );

  if (!node) return null;

  const incomingConnections = connections.filter((c) => c.target === node.id);
  const outgoingConnections = connections.filter((c) => c.source === node.id);

  const handleUpdate = (field: string, value: any) => {
    onUpdate(node.id, {
      data: {
        ...node.data,
        [field]: value,
      },
    });
  };

  const handleConfigUpdate = (key: string, value: any) => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
    onUpdate(node.id, {
      data: {
        ...node.data,
        config: newConfig,
      },
    });
  };

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-sm">Node Properties</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="general" className="flex-1">
              <Settings className="h-3 w-3 mr-1" />
              General
            </TabsTrigger>
            <TabsTrigger value="config" className="flex-1">
              <Code className="h-3 w-3 mr-1" />
              Config
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex-1">
              <Link2 className="h-3 w-3 mr-1" />
              Links
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="p-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Node Name
              </label>
              <Input
                type="text"
                value={node.data.label}
                onChange={(e) => handleUpdate("label", e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Description
              </label>
              <Textarea
                value={node.data.description || ""}
                onChange={(e) => handleUpdate("description", e.target.value)}
                className="text-sm min-h-[80px]"
                placeholder="Add description..."
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Node Type
              </label>
              <Badge variant="outline">{node.type}</Badge>
            </div>
            {onToggleBreakpoint && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Debug Options
                </label>
                <Button
                  variant={node.data.breakpoint ? "default" : "outline"}
                  size="sm"
                  onClick={() => onToggleBreakpoint(node.id)}
                  className="w-full"
                >
                  {node.data.breakpoint ? "Breakpoint Active" : "Add Breakpoint"}
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="config" className="p-4">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Configuration
                </label>
                <div className="p-3 border border-border rounded-md bg-background text-xs text-muted-foreground">
                  {node.type}-specific configuration will appear here
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Parameters
                </label>
                <div className="space-y-2">
                  {Object.entries(localConfig).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <Input
                        placeholder="Key"
                        value={key}
                        disabled
                        className="h-8 text-xs"
                      />
                      <Input
                        placeholder="Value"
                        value={String(value)}
                        onChange={(e) => handleConfigUpdate(key, e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    Add Parameter
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="connections" className="p-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Outgoing Connections ({outgoingConnections.length})
                </label>
                {outgoingConnections.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No outgoing connections
                  </p>
                ) : (
                  <div className="space-y-1">
                    {outgoingConnections.map((conn) => {
                      const targetNode = allNodes.find((n) => n.id === conn.target);
                      return (
                        <div
                          key={conn.id}
                          className="flex items-center gap-2 p-2 rounded border border-border"
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              targetNode?.data.color || "bg-gray-500"
                            }`}
                          />
                          <span className="text-xs flex-1">
                            {targetNode?.data.label || "Unknown"}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => onDeleteConnection(conn.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Incoming Connections ({incomingConnections.length})
                </label>
                {incomingConnections.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No incoming connections
                  </p>
                ) : (
                  <div className="space-y-1">
                    {incomingConnections.map((conn) => {
                      const sourceNode = allNodes.find((n) => n.id === conn.source);
                      return (
                        <div
                          key={conn.id}
                          className="flex items-center gap-2 p-2 rounded border border-border"
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              sourceNode?.data.color || "bg-gray-500"
                            }`}
                          />
                          <span className="text-xs flex-1">
                            {sourceNode?.data.label || "Unknown"}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => onDeleteConnection(conn.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}

