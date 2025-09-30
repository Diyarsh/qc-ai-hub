import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Brain, Sparkles, Wand2, Settings } from "lucide-react";

export default function AIStudio() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">AI-Студия</h1>
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">AI-Студия</h2>
            <p className="text-muted-foreground">
              Создавайте и настраивайте AI-модели для ваших задач
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card border-border hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <Brain className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Обучение моделей</CardTitle>
                <CardDescription>
                  Создайте собственную AI-модель на основе ваших данных
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Начать обучение</Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <Sparkles className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Готовые модели</CardTitle>
                <CardDescription>
                  Используйте предобученные модели для быстрого старта
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Обзор моделей</Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <Wand2 className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Настройка</CardTitle>
                <CardDescription>
                  Тонкая настройка параметров и оптимизация модели
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Настроить</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}