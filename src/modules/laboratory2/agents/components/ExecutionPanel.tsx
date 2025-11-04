import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExecutionLog {
  id: string;
  timestamp: Date;
  level: "info" | "success" | "error" | "warning";
  message: string;
  nodeId?: string;
  nodeName?: string;
  data?: any;
}

interface ExecutionPanelProps {
  logs: ExecutionLog[];
  isExecuting: boolean;
  onClear: () => void;
  onStop?: () => void;
}

export function ExecutionPanel({
  logs,
  isExecuting,
  onClear,
  onStop,
}: ExecutionPanelProps) {
  const getLogIcon = (level: ExecutionLog["level"]) => {
    switch (level) {
      case "success":
        return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      case "error":
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-3 w-3 text-yellow-500" />;
      default:
        return <Clock className="h-3 w-3 text-blue-500" />;
    }
  };

  const getLogColor = (level: ExecutionLog["level"]) => {
    switch (level) {
      case "success":
        return "text-green-600 dark:text-green-400";
      case "error":
        return "text-red-600 dark:text-red-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">Execution Log</h3>
          {isExecuting && (
            <Badge variant="outline" className="text-xs">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Running
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isExecuting && onStop && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onStop}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {logs.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              No execution logs yet
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className={cn(
                  "flex items-start gap-2 p-2 rounded-md border border-border bg-background/50",
                  log.nodeId && "bg-muted/30"
                )}
              >
                <div className="mt-0.5">{getLogIcon(log.level)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        "text-xs font-mono font-medium",
                        getLogColor(log.level)
                      )}
                    >
                      {log.message}
                    </span>
                    {log.nodeName && (
                      <Badge variant="outline" className="text-xs">
                        {log.nodeName}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {log.timestamp.toLocaleTimeString()}
                  </div>
                  {log.data && (
                    <details className="mt-1">
                      <summary className="text-xs text-muted-foreground cursor-pointer">
                        View data
                      </summary>
                      <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))
          )}
          {isExecuting && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Executing workflow...</span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

