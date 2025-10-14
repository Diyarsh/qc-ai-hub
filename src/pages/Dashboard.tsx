import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Bot, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatComposer } from "@/components/ChatComposer";
import { ScrollArea } from "@/components/ui/scroll-area";
export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const examplePrompts = ["Создайте ИИ-агента для анализа документов и извлечения ключевой информации", "Разработайте чат-бота для обработки клиентских запросов с использованием NLP", "Настройте модель машинного обучения для прогнозирования трендов продаж", "Интегрируйте API для обработки естественного языка в существующую систему", "Создайте автоматизированную систему классификации и тегирования контента", "Разработайте рекомендательную систему на основе поведения пользователей"];
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; text: string }[]>([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt(prev => (prev + 1) % examplePrompts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const handleSend = (text: string) => {
    const prompt = text.trim();
    if (!prompt) return;
    const userMsg = { id: Math.random().toString(36).slice(2), role: 'user' as const, text: prompt };
    const assistantMsg = { id: Math.random().toString(36).slice(2), role: 'assistant' as const, text: 'Принято. Я подготовлю ответ. Уточните детали, если нужно.' };
    setMessages(prev => [...prev, userMsg, assistantMsg]);
    try {
      const ls = JSON.parse(localStorage.getItem('dashboard.history') || '[]');
      ls.unshift({ text: prompt, time: new Date().toISOString(), type: 'chat', model: 'GPT-4' });
      localStorage.setItem('dashboard.history', JSON.stringify(ls.slice(0, 100)));
    } catch {}
    setInput("");
  };
  return <div className="flex flex-col h-full">
      <PageHeader />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        <div className="w-full max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-8">{t('dashboard.title')}</h2>

          {/* Central Input */}
          <div className="relative mb-8">
            <ChatComposer
              value={input}
              onChange={setInput}
              onSend={handleSend}
              examples={examplePrompts}
            />
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