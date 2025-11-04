import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Mail, 
  Database, 
  Sparkles, 
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Shield,
  Search,
  X
} from "lucide-react";

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  tags: string[];
  nodes: any[];
  connections: any[];
}

const templates: WorkflowTemplate[] = [
  {
    id: "faq-bot",
    name: "FAQ-бот по документам",
    description: "RAG workflow для ответов на вопросы по документам компании",
    category: "Knowledge",
    icon: FileText,
    tags: ["RAG", "Chat", "Knowledge"],
    nodes: [],
    connections: [],
  },
  {
    id: "email-processor",
    name: "Агент обработки писем",
    description: "Обработка входящих писем и генерация резюме/тикетов",
    category: "Automation",
    icon: Mail,
    tags: ["Email", "Summary", "Ticket"],
    nodes: [],
    connections: [],
  },
  {
    id: "data-assistant",
    name: "Data-assistant для отдела",
    description: "Chat → SQL-узел → визуализация → отчёт",
    category: "Data",
    icon: Database,
    tags: ["Chat", "SQL", "Visualization"],
    nodes: [],
    connections: [],
  },
  {
    id: "content-assistant",
    name: "Контент-ассистент",
    description: "Генерация, проверка стиля/тональности, модерация",
    category: "Content",
    icon: Sparkles,
    tags: ["Generation", "Moderation", "Content"],
    nodes: [],
    connections: [],
  },
  {
    id: "incident-bot",
    name: "Инцидент-бот",
    description: "Webhook → обогащение → уведомления → протокол",
    category: "Operations",
    icon: AlertTriangle,
    tags: ["Webhook", "Notifications", "Incident"],
    nodes: [],
    connections: [],
  },
];

interface TemplateGalleryProps {
  onSelectTemplate: (template: WorkflowTemplate) => void;
  onClose: () => void;
}

export function TemplateGallery({
  onSelectTemplate,
  onClose,
}: TemplateGalleryProps) {
  const categories = Array.from(new Set(templates.map((t) => t.category)));

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Workflow Templates</CardTitle>
            <CardDescription>
              Choose a template to get started quickly
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-6">
              {categories.map((category) => {
                const categoryTemplates = templates.filter(
                  (t) => t.category === category
                );
                return (
                  <div key={category}>
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryTemplates.map((template) => (
                        <Card
                          key={template.id}
                          className="cursor-pointer hover:border-primary transition-colors"
                          onClick={() => {
                            onSelectTemplate(template);
                            onClose();
                          }}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <template.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <CardTitle className="text-base">
                                    {template.name}
                                  </CardTitle>
                                </div>
                              </div>
                            </div>
                            <CardDescription className="mt-2">
                              {template.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-1">
                              {template.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

