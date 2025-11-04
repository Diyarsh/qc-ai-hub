import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, BarChart3, TrendingUp, Brain, CheckCircle2 } from "lucide-react";

export interface AutoMLTask {
  id: string;
  name: string;
  type: "regression" | "classification" | "time_series";
  targetColumn: string;
  datasetId: string;
  status: "pending" | "running" | "completed" | "error";
  models?: AutoMLModel[];
  metrics?: Record<string, number>;
  createdAt: Date;
}

export interface AutoMLModel {
  name: string;
  type: "linear" | "tree" | "gbm" | "neural";
  metrics: Record<string, number>;
  featureImportance?: Record<string, number>;
}

interface AutoMLProps {
  tasks: AutoMLTask[];
  onStartTask: (task: Partial<AutoMLTask>) => void;
  onSelectTask: (task: AutoMLTask) => void;
}

export function AutoML({ tasks, onStartTask, onSelectTask }: AutoMLProps) {
  const [newTask, setNewTask] = useState<Partial<AutoMLTask>>({
    type: "classification",
    name: "",
    targetColumn: "",
  });

  const handleStart = () => {
    if (newTask.name && newTask.targetColumn) {
      onStartTask(newTask);
      setNewTask({ type: "classification", name: "", targetColumn: "" });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm mb-4">AutoML Lite</h3>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Create New Task</CardTitle>
            <CardDescription className="text-xs">
              Configure and start an AutoML training task
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">Task Name</Label>
              <Input
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                placeholder="e.g., Sales Prediction"
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Task Type</Label>
              <Select
                value={newTask.type}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, type: value as AutoMLTask["type"] })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regression">Regression</SelectItem>
                  <SelectItem value="classification">Classification</SelectItem>
                  <SelectItem value="time_series">Time Series</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Target Column</Label>
              <Input
                value={newTask.targetColumn}
                onChange={(e) =>
                  setNewTask({ ...newTask, targetColumn: e.target.value })
                }
                placeholder="column_name"
                className="h-8 text-xs"
              />
            </div>
            <Button size="sm" onClick={handleStart} className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Start Training
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="tasks" className="h-full flex flex-col">
          <TabsList className="mx-4 mt-4">
            <TabsTrigger value="tasks" className="flex-1">
              Tasks
            </TabsTrigger>
            <TabsTrigger value="models" className="flex-1">
              Models
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="flex-1 overflow-auto p-4">
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No tasks yet. Create a new task to get started.
                </div>
              ) : (
                tasks.map((task) => (
                  <Card
                    key={task.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => onSelectTask(task)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-sm">{task.name}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {task.type} • Target: {task.targetColumn}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            task.status === "completed"
                              ? "default"
                              : task.status === "error"
                              ? "destructive"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {task.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    {task.metrics && (
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-4 text-xs">
                          {Object.entries(task.metrics).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{key}:</span>
                              <span className="font-medium">{value.toFixed(3)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="models" className="flex-1 overflow-auto p-4">
            <div className="space-y-2">
              {tasks
                .filter((t) => t.models && t.models.length > 0)
                .flatMap((task) =>
                  task.models!.map((model, idx) => (
                    <Card key={`${task.id}-${idx}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-sm">{model.name}</CardTitle>
                            <CardDescription className="text-xs mt-1">
                              {task.name} • {model.type}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {model.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="text-xs font-medium">Metrics:</div>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(model.metrics).map(([key, value]) => (
                              <Badge key={key} variant="outline" className="text-xs">
                                {key}: {value.toFixed(3)}
                              </Badge>
                            ))}
                          </div>
                          {model.featureImportance && (
                            <div className="mt-2">
                              <div className="text-xs font-medium mb-1">
                                Top Features:
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {Object.entries(model.featureImportance)
                                  .sort((a, b) => b[1] - a[1])
                                  .slice(0, 5)
                                  .map(([feature, importance]) => (
                                    <Badge
                                      key={feature}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {feature}: {importance.toFixed(2)}
                                    </Badge>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )
                .length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No trained models yet
                </div>
              ) : (
                tasks
                  .filter((t) => t.models && t.models.length > 0)
                  .flatMap((task) =>
                    task.models!.map((model, idx) => (
                      <Card key={`${task.id}-${idx}`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-sm">{model.name}</CardTitle>
                              <CardDescription className="text-xs mt-1">
                                {task.name} • {model.type}
                              </CardDescription>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {model.type}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            <div className="text-xs font-medium">Metrics:</div>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(model.metrics).map(([key, value]) => (
                                <Badge key={key} variant="outline" className="text-xs">
                                  {key}: {value.toFixed(3)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

