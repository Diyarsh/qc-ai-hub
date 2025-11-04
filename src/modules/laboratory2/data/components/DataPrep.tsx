import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Trash2, 
  ArrowRight,
  Filter,
  Merge,
  BarChart3,
  Save
} from "lucide-react";

export interface DataPrepStep {
  id: string;
  type: "clean" | "join" | "aggregate" | "transform" | "filter";
  config: Record<string, any>;
  description: string;
}

interface DataPrepProps {
  steps: DataPrepStep[];
  onAddStep: (type: DataPrepStep["type"]) => void;
  onRemoveStep: (stepId: string) => void;
  onUpdateStep: (stepId: string, config: Record<string, any>) => void;
  onSaveRecipe: () => void;
}

export function DataPrep({
  steps,
  onAddStep,
  onRemoveStep,
  onUpdateStep,
  onSaveRecipe,
}: DataPrepProps) {
  const getStepIcon = (type: DataPrepStep["type"]) => {
    switch (type) {
      case "clean":
        return Filter;
      case "join":
        return Merge;
      case "aggregate":
        return BarChart3;
      case "transform":
        return ArrowRight;
      case "filter":
        return Filter;
      default:
        return ArrowRight;
    }
  };

  const getStepColor = (type: DataPrepStep["type"]) => {
    switch (type) {
      case "clean":
        return "bg-blue-500";
      case "join":
        return "bg-green-500";
      case "aggregate":
        return "bg-purple-500";
      case "transform":
        return "bg-orange-500";
      case "filter":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">Data Preparation</h3>
          <p className="text-xs text-muted-foreground">
            Visual data transformation pipeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onSaveRecipe}>
            <Save className="h-4 w-4 mr-2" />
            Save Recipe
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddStep("clean")}
            >
              <Plus className="h-4 w-4 mr-1" />
              Clean
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddStep("join")}
            >
              <Plus className="h-4 w-4 mr-1" />
              Join
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddStep("aggregate")}
            >
              <Plus className="h-4 w-4 mr-1" />
              Aggregate
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {steps.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              No transformation steps. Add steps to build your pipeline.
            </div>
          ) : (
            steps.map((step, index) => {
              const StepIcon = getStepIcon(step.type);
              return (
                <div key={step.id} className="flex items-center gap-4">
                  <Card className="flex-1">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${getStepColor(step.type)}`}
                          >
                            <StepIcon className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-sm capitalize">
                              {step.type}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                              {step.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Step {index + 1}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onRemoveStep(step.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">
                        Configuration: {JSON.stringify(step.config)}
                      </div>
                    </CardContent>
                  </Card>
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

