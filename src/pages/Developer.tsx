import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Terminal, Database, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function Developer() {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">{t('sidebar.developer')}</h1>
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
            <Code className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Режим разработчика</h2>
            <p className="text-muted-foreground">Инструменты для разработки и интеграции</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <Terminal className="h-12 w-12 text-green-500 mb-4" />
                <CardTitle>API Консоль</CardTitle>
                <CardDescription>
                  Тестирование и отладка API запросов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Открыть консоль</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <Database className="h-12 w-12 text-blue-500 mb-4" />
                <CardTitle>База данных</CardTitle>
                <CardDescription>
                  Управление данными и схемами
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Управление БД</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <Zap className="h-12 w-12 text-purple-500 mb-4" />
                <CardTitle>API Ключи</CardTitle>
                <CardDescription>
                  Генерация и управление ключами доступа
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Управление ключами</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <Code className="h-12 w-12 text-orange-500 mb-4" />
                <CardTitle>Документация</CardTitle>
                <CardDescription>
                  SDK и примеры интеграции
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Открыть docs</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}