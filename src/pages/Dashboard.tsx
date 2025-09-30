import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Send, Paperclip, FileText, Bot, Sun, Moon, Settings } from "lucide-react";
import { useTheme } from "next-themes";

export default function Dashboard() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">AI-HUB</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">RU</span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        <div className="w-full max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-8">AI-HUB</h2>
          
          {/* Message Input */}
          <div className="relative mb-8">
            <Input
              placeholder="Записать голосовое сообщение..."
              className="h-12 pr-20 text-lg bg-muted border-border"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button size="icon" className="h-8 w-8 bg-primary">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-border hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="text-center">
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Обработка документов</CardTitle>
                <CardDescription>
                  Анализ и извлечение данных
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="text-center">
                <Bot className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Боты</CardTitle>
                <CardDescription>
                  Автоматизация и чат-боты
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="text-center">
                <Settings className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">От Разработчиков</CardTitle>
                <CardDescription>
                  Готовые решения и модели
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}