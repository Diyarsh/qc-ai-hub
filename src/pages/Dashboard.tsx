import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Send, Paperclip, FileText, Bot, Sun, Moon, Settings, Code } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDeveloperMode } from "@/contexts/DeveloperModeContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const { isDeveloperMode, toggleDeveloperMode } = useDeveloperMode();
  
  const examplePrompts = [
    "Создайте ИИ-агента для анализа документов и извлечения ключевой информации",
    "Разработайте чат-бота для обработки клиентских запросов с использованием NLP",
    "Настройте модель машинного обучения для прогнозирования трендов продаж",
    "Интегрируйте API для обработки естественного языка в существующую систему",
    "Создайте автоматизированную систему классификации и тегирования контента",
    "Разработайте рекомендательную систему на основе поведения пользователей"
  ];
  
  const [currentPrompt, setCurrentPrompt] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => (prev + 1) % examplePrompts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border">
            <Code className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Dev Mode</span>
            <Switch 
              checked={isDeveloperMode}
              onCheckedChange={toggleDeveloperMode}
              className="ml-1"
            />
          </div>

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
        <div className="w-full max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-8">{t('dashboard.title')}</h2>
          
          {/* Message Input */}
          <div className="relative mb-8">
            <Textarea
              placeholder={examplePrompts[currentPrompt]}
              className="min-h-[120px] pr-20 text-lg bg-muted border-border resize-none"
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button size="icon" className="h-8 w-8 bg-primary">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
            <Card className="bg-card border-border">
              <CardHeader className="text-center py-2 px-3">
                <FileText className="h-5 w-5 text-primary mx-auto mb-1" />
                <CardTitle className="text-sm font-medium">{t('dashboard.documents.title')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('dashboard.documents.desc')}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="text-center py-2 px-3">
                <Bot className="h-5 w-5 text-primary mx-auto mb-1" />
                <CardTitle className="text-sm font-medium">{t('dashboard.bots.title')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('dashboard.bots.desc')}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="text-center py-2 px-3">
                <Settings className="h-5 w-5 text-primary mx-auto mb-1" />
                <CardTitle className="text-sm font-medium">{t('dashboard.developers.title')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('dashboard.developers.desc')}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}