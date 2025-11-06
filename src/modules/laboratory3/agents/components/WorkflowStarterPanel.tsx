import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MousePointerClick, Link2, Clock, Cloud, FileText, ArrowRight, MessageSquare, CheckSquare, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

interface TriggerOption {
  id: string;
  label: string;
  description: string;
  icon: any;
  category: string;
  popular?: boolean;
}

const triggerOptions: TriggerOption[] = [
  {
    id: "manual",
    label: "Trigger manually",
    description: "Runs the flow on clicking a button in n8n. Good for getting started quickly",
    icon: MousePointerClick,
    category: "core",
    popular: true,
  },
  {
    id: "app-event",
    label: "On app event",
    description: "Runs the flow when something happens in an app like Telegram, Notion or Airtable",
    icon: Link2,
    category: "integrations",
    popular: true,
  },
  {
    id: "schedule",
    label: "On a schedule",
    description: "Runs the flow every day, hour, or custom interval",
    icon: Clock,
    category: "core",
    popular: true,
  },
  {
    id: "webhook",
    label: "On webhook call",
    description: "Runs the flow on receiving an HTTP request",
    icon: Cloud,
    category: "core",
    popular: true,
  },
  {
    id: "form",
    label: "On form submission",
    description: "Generate webforms in n8n and pass their responses to the workflow",
    icon: FileText,
    category: "integrations",
  },
  {
    id: "workflow",
    label: "When executed by another workflow",
    description: "Runs the flow when called by the Execute Workflow node from a different workflow",
    icon: ArrowRight,
    category: "advanced",
  },
  {
    id: "chat",
    label: "On chat message",
    description: "Runs the flow when a user sends a chat message. For use with AI nodes",
    icon: MessageSquare,
    category: "ai",
  },
  {
    id: "evaluation",
    label: "When running evaluation",
    description: "Run a dataset through your workflow to test performance",
    icon: CheckSquare,
    category: "advanced",
  },
  {
    id: "other",
    label: "Other ways...",
    description: "Runs the flow on workflow errors, file changes, etc.",
    icon: Folder,
    category: "advanced",
  },
];

interface WorkflowStarterPanelProps {
  onSelectTrigger?: (trigger: TriggerOption) => void;
}

export function WorkflowStarterPanel({ onSelectTrigger }: WorkflowStarterPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTriggers = triggerOptions.filter(
    (trigger) =>
      trigger.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trigger.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularTriggers = filteredTriggers.filter((t) => t.popular);
  const otherTriggers = filteredTriggers.filter((t) => !t.popular);

  const handleSelectTrigger = (trigger: TriggerOption) => {
    onSelectTrigger?.(trigger);
  };

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold mb-2">What triggers this workflow?</h2>
        <p className="text-sm text-muted-foreground">
          A trigger is a step that starts your workflow
        </p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Q Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
      </div>

      {/* Trigger List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {popularTriggers.length > 0 && (
            <div className="mb-4">
              {popularTriggers.map((trigger) => (
                <div
                  key={trigger.id}
                  onClick={() => handleSelectTrigger(trigger)}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                    "hover:bg-muted/50 border border-transparent hover:border-border"
                  )}
                >
                  <div className="mt-0.5">
                    <trigger.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium mb-1">{trigger.label}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {trigger.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {otherTriggers.length > 0 && (
            <div className="space-y-1">
              {otherTriggers.map((trigger) => (
                <div
                  key={trigger.id}
                  onClick={() => handleSelectTrigger(trigger)}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                    "hover:bg-muted/50 border border-transparent hover:border-border"
                  )}
                >
                  <div className="mt-0.5">
                    <trigger.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium mb-1">{trigger.label}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {trigger.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredTriggers.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">
              No triggers found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

