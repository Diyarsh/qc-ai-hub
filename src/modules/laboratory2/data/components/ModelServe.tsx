import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Play, CheckCircle2, AlertCircle, Globe, Key, Code } from "lucide-react";
import { useToast } from "@/shared/components/Toast";

export interface ServedModel {
  id: string;
  name: string;
  modelId: string;
  endpoint: string;
  version: string;
  status: "active" | "inactive" | "error";
  schema: {
    input: Record<string, any>;
    output: Record<string, any>;
  };
  token?: string;
  createdAt: Date;
}

interface ModelServeProps {
  models: ServedModel[];
  onDeploy: (modelId: string, config: Record<string, any>) => void;
  onStop: (modelId: string) => void;
}

export function ModelServe({ models, onDeploy, onStop }: ModelServeProps) {
  const { showToast } = useToast();
  const [selectedModel, setSelectedModel] = useState<ServedModel | null>(null);

  const handleCopyEndpoint = (endpoint: string) => {
    navigator.clipboard.writeText(endpoint);
    showToast("Endpoint URL copied to clipboard", "success");
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    showToast("Token copied to clipboard", "success");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm mb-2">Model Serving</h3>
        <p className="text-xs text-muted-foreground">
          Deploy and manage model endpoints
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {models.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No deployed models yet
              </CardContent>
            </Card>
          ) : (
            models.map((model) => (
              <Card
                key={model.id}
                className={selectedModel?.id === model.id ? "border-primary" : ""}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm">{model.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        Version {model.version} • Model ID: {model.modelId}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          model.status === "active"
                            ? "default"
                            : model.status === "error"
                            ? "destructive"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {model.status === "active" && (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        )}
                        {model.status === "error" && (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {model.status}
                      </Badge>
                      {model.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onStop(model.id)}
                        >
                          Stop
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs">Endpoint URL</Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => handleCopyEndpoint(model.endpoint)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded text-xs font-mono">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <span className="flex-1 truncate">{model.endpoint}</span>
                    </div>
                  </div>

                  {model.token && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs">API Token</Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => handleCopyToken(model.token!)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-muted rounded text-xs font-mono">
                        <Key className="h-3 w-3 text-muted-foreground" />
                        <span className="flex-1 truncate">{model.token}</span>
                      </div>
                    </div>
                  )}

                  <Tabs defaultValue="schema" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="schema" className="flex-1 text-xs">
                        Schema
                      </TabsTrigger>
                      <TabsTrigger value="test" className="flex-1 text-xs">
                        Test
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="schema" className="space-y-2 mt-2">
                      <div>
                        <Label className="text-xs">Input Schema</Label>
                        <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">
                          {JSON.stringify(model.schema.input, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <Label className="text-xs">Output Schema</Label>
                        <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">
                          {JSON.stringify(model.schema.output, null, 2)}
                        </pre>
                      </div>
                    </TabsContent>
                    <TabsContent value="test" className="mt-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xs">Test Client</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <Label className="text-xs">Input JSON</Label>
                            <textarea
                              className="w-full p-2 bg-muted rounded text-xs font-mono min-h-[100px]"
                              placeholder='{"feature1": 0.5, "feature2": 0.3}'
                            />
                          </div>
                          <Button size="sm" className="w-full">
                            <Play className="h-3 w-3 mr-2" />
                            Test Prediction
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

