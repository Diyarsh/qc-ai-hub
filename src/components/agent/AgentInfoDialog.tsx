import { LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type AgentCategory = "all" | "language" | "assistant" | "documents" | "code" | "industrial";
type AgentType = "agent" | "developer";

interface Agent {
  id: string;
  name: string;
  description: string;
  category: AgentCategory[];
  type: AgentType;
  instructions: string;
  placeholder: string;
  tags: string[];
  isLocal: boolean;
  icon: LucideIcon;
  featured?: boolean;
  gradient?: string;
}

interface AgentInfoDialogProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
}

const categoryLabels: Record<AgentCategory, string> = {
  all: "Все",
  language: "Языковые модели",
  assistant: "Корпоративный ассистент",
  documents: "Документы",
  code: "Код",
  industrial: "Промышленные",
};

export function AgentInfoDialog({
  agent,
  isOpen,
  onClose,
}: AgentInfoDialogProps) {
  if (!agent) return null;

  const Icon = agent.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              agent.featured
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl">{agent.name}</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            {agent.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Instructions Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Инструкции</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {agent.instructions}
            </p>
          </div>

          <Separator />

          {/* Example Request Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Пример запроса</h3>
            <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
              <p className="text-sm text-muted-foreground italic">
                {agent.placeholder}
              </p>
            </div>
          </div>

          <Separator />

          {/* Tags Section */}
          {agent.tags.length > 0 && (
            <>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Теги</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Metadata Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Метаданные</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Тип</p>
                <p className="text-sm font-medium">
                  {agent.type === "agent" ? "Агент" : "Разработчик"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Статус</p>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs w-fit",
                    agent.isLocal
                      ? "bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-300 border-green-400/50 dark:border-green-500/50"
                      : "bg-blue-500/20 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300 border-blue-400/50 dark:border-blue-500/50"
                  )}
                >
                  {agent.isLocal ? "Локальный" : "Внешний"}
                </Badge>
              </div>
              {agent.category && agent.category.length > 0 && (
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Категории</p>
                  <div className="flex flex-wrap gap-2">
                    {agent.category.map((cat) => (
                      <Badge
                        key={cat}
                        variant="outline"
                        className="text-xs"
                      >
                        {categoryLabels[cat] || cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
