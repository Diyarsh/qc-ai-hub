import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChatComposer } from "@/components/ChatComposer";
export default function AIStudioChat() {
  const {
    t
  } = useLanguage();
  const location = useLocation();
  const agent = (location.state as any)?.agent as string | undefined;
  const placeholder = (location.state as any)?.placeholder as string | undefined;
  const initialMessage = (location.state as any)?.initialMessage as string | undefined;
  const [message, setMessage] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);
  const examplePrompts = ["Сформируй краткую сводку по рынку за Q3 2025", "Подготовь анализ конкурентов в сфере e-commerce", "Предложи 3 риск-фактора для проекта AI", "Составь план внедрения чата-бота в службу поддержки"];
  const handleSend = (textOverride?: string) => {
    const text = (textOverride ?? message).trim();
    if (!text) return;
    setMessage("");
  };

  // preload initial message from navigation (e.g., Dashboard)
  if (initialMessage && !hasInitialized) {
    setTimeout(() => {
      handleSend(initialMessage);
      setHasInitialized(true);
    }, 0);
  }
  return <div className="flex flex-col h-screen">
      <PageHeader title={t('ai-studio.title')} subtitle={t('ai-studio.subtitle')} />
      <main className="flex-1 flex min-h-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 border-t">
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">{agent ? `Чат с агентом: ${agent}` : 'Начать беседу'}</h2>
                <p className="text-muted-foreground max-w-md">Задавайте вопросы выбранному агенту из AI Studio</p>
              </div>
            </div>
          </ScrollArea>
          <div className="p-4">
            <div className="max-w-3xl mx-auto">
              <ChatComposer value={message} placeholder={placeholder} examples={examplePrompts} onChange={setMessage} onSend={() => handleSend()} className="mb-3" />
            </div>
          </div>
        </div>
      </main>
    </div>;
}