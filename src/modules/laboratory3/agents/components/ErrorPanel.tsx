import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, X, RefreshCw, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorPanelProps {
  error: string;
  onClose: () => void;
  onAddNode: (nodeType: any) => void;
}

const errorSolutions = [
  {
    title: "Check node configuration",
    description: "Verify that all required fields are filled correctly",
    action: "Review Settings",
  },
  {
    title: "Add error handling",
    description: "Add error handling nodes to catch and process errors",
    action: "Add Error Handler",
  },
  {
    title: "Check connections",
    description: "Ensure all nodes are properly connected",
    action: "Fix Connections",
  },
];

export function ErrorPanel({ error, onClose, onAddNode }: ErrorPanelProps) {
  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <h3 className="font-semibold text-sm">Error</h3>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-sm">Детали ошибки</AlertTitle>
            <AlertDescription className="text-sm mt-2 font-mono break-all">
              {error}
            </AlertDescription>
          </Alert>

          <div>
            <h4 className="text-sm font-medium mb-3">Suggested Solutions</h4>
            <div className="space-y-2">
              {errorSolutions.map((solution, index) => (
                <Card key={index} className="cursor-pointer hover:border-primary transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{solution.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {solution.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        // Handle solution action
                        onClose();
                      }}
                    >
                      {solution.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // Retry logic
              onClose();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}

