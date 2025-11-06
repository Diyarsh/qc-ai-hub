import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Brain, Globe, Pencil, Link2, Briefcase, User, Zap, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NextStepCategory {
  id: string;
  label: string;
  description: string;
  icon: any;
  nodeTypes: string[]; // Types of nodes in this category
}

const nextStepCategories: NextStepCategory[] = [
  {
    id: "ai",
    label: "AI",
    description: "Build autonomous agents, summarize or search documents, etc.",
    icon: Brain,
    nodeTypes: ["llm", "knowledge"],
  },
  {
    id: "action",
    label: "Action in an app",
    description: "Do something in an app or service like Google Sheets, Telegram or Notion",
    icon: Globe,
    nodeTypes: ["tool", "action"],
  },
  {
    id: "data",
    label: "Data transformation",
    description: "Manipulate, filter or convert data",
    icon: Pencil,
    nodeTypes: ["tool"],
  },
  {
    id: "flow",
    label: "Flow",
    description: "Branch, merge or loop the flow, etc.",
    icon: Link2,
    nodeTypes: ["tool", "eval"],
  },
  {
    id: "core",
    label: "Core",
    description: "Run code, make HTTP requests, set webhooks, etc.",
    icon: Briefcase,
    nodeTypes: ["tool", "action"],
  },
  {
    id: "human",
    label: "Human in the loop",
    description: "Wait for approval or human input before continuing",
    icon: User,
    nodeTypes: ["action", "eval"],
  },
  {
    id: "trigger",
    label: "Add another trigger",
    description: "Triggers start your workflow. Workflows can have multiple triggers.",
    icon: Zap,
    nodeTypes: ["trigger"],
  },
];

interface NextStepsPanelProps {
  onSelectCategory?: (category: NextStepCategory) => void;
  onSelectNodeType?: (nodeType: string) => void;
}

export function NextStepsPanel({ onSelectCategory, onSelectNodeType }: NextStepsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = nextStepCategories.filter(
    (category) =>
      category.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (category: NextStepCategory) => {
    onSelectCategory?.(category);
  };

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold mb-2">What happens next?</h2>
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

      {/* Categories List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors group",
                "hover:bg-muted/50 border border-transparent hover:border-border"
              )}
            >
              <div className="mt-0.5">
                <category.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium mb-1">{category.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {category.description}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">
              No categories found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

