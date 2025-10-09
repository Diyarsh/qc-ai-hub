import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Paperclip, FileText, Bot, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const examplePrompts = ["Создайте ИИ-агента для анализа документов и извлечения ключевой информации", "Разработайте чат-бота для обработки клиентских запросов с использованием NLP", "Настройте модель машинного обучения для прогнозирования трендов продаж", "Интегрируйте API для обработки естественного языка в существующую систему", "Создайте автоматизированную систему классификации и тегирования контента", "Разработайте рекомендательную систему на основе поведения пользователей"];
  const [currentPrompt, setCurrentPrompt] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt(prev => (prev + 1) % examplePrompts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return <div className="flex flex-col h-full">
      <PageHeader />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        <div className="w-full max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-8">{t('dashboard.title')}</h2>
          
          {/* Message Input */}
          <div className="relative mb-8">
            <div className="flex items-start gap-2 p-3 bg-background border border-border rounded-xl">
              <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8 mt-1">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Textarea
                placeholder={examplePrompts[currentPrompt]}
                className="flex-1 min-h-[60px] resize-none border-0 bg-transparent p-2 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                rows={2}
              />
              <Button size="icon" className="flex-shrink-0 h-8 w-8 mt-1">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full mx-auto">
            <Card onClick={() => navigate('/ai-studio-chat', { state: { agent: 'KazDoc AI', placeholder: 'Задайте вопрос по документам' } })} className="bg-card border-border cursor-pointer transition hover:bg-muted/50">
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-left">{t('dashboard.documents.title')}</CardTitle>
                    <CardDescription className="text-xs text-left">
                      {t('dashboard.documents.desc')}
                    </CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card onClick={() => navigate('/ai-studio-chat', { state: { agent: 'QazAssistant Pro', placeholder: 'Опишите задачу для чат-бота' } })} className="bg-card border-border cursor-pointer transition hover:bg-muted/50">
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-left">{t('dashboard.bots.title')}</CardTitle>
                    <CardDescription className="text-xs text-left">
                      {t('dashboard.bots.desc')}
                    </CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card onClick={() => navigate('/ai-studio-chat', { state: { agent: 'KazCode Assistant', placeholder: 'Что требуется разработать?' } })} className="bg-card border-border cursor-pointer transition hover:bg-muted/50">
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    <Settings className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-left">{t('dashboard.developers.title')}</CardTitle>
                    <CardDescription className="text-xs text-left">
                      {t('dashboard.developers.desc')}
                    </CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>;
}