import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, Zap, Brain, Cpu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function Lab() {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">{t('sidebar.lab')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
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
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <FlaskConical className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Экспериментальная лаборатория</h2>
            <p className="text-muted-foreground">Исследования и разработка новых AI решений</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-dashed border-2 hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="text-center">
                <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <CardTitle>Быстрые эксперименты</CardTitle>
                <CardDescription>
                  Тестирование новых алгоритмов
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-dashed border-2 hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="text-center">
                <Brain className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <CardTitle>Нейронные сети</CardTitle>
                <CardDescription>
                  Обучение и тестирование моделей
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-dashed border-2 hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="text-center">
                <Cpu className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>Вычислительные ресурсы</CardTitle>
                <CardDescription>
                  Мониторинг производительности
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}