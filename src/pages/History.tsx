import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Clock, Calendar, Settings } from "lucide-react";

const historyItems = [
  {
    id: 1,
    title: "Анализ документа отчета",
    timestamp: "2 часа назад",
    type: "Документ",
    status: "Завершено"
  },
  {
    id: 2,
    title: "Создание чат-бота поддержки",
    timestamp: "Вчера",
    type: "Бот",
    status: "В процессе"
  },
  {
    id: 3,
    title: "Обработка изображений продуктов",
    timestamp: "3 дня назад",
    type: "Изображения",
    status: "Завершено"
  },
  {
    id: 4,
    title: "Генерация контента для сайта",
    timestamp: "1 неделя назад",
    type: "Текст",
    status: "Завершено"
  }
];

export default function History() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">История</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">RU</span>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">История активности</h2>
            <p className="text-muted-foreground">
              Просмотрите историю ваших запросов и проектов
            </p>
          </div>

          <div className="space-y-4">
            {historyItems.map((item) => (
              <Card key={item.id} className="bg-card border-border hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <MessageCircle className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {item.timestamp}
                          </div>
                          <Badge variant="secondary">{item.type}</Badge>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={item.status === "Завершено" ? "default" : "secondary"}
                      className={item.status === "В процессе" ? "bg-yellow-500/10 text-yellow-600" : ""}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {historyItems.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">История пуста</h3>
              <p className="text-muted-foreground">
                Начните работу с AI-HUB, чтобы увидеть историю ваших запросов
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}