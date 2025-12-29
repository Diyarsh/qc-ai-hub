import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Bot, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChatComposer } from "@/components/ChatComposer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendChatMessage } from "@/shared/services/ai.service.ts";
import { useToast } from "@/shared/components/Toast";
import { MessageBubble } from "@/components/chat/MessageBubble";
export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const examplePrompts = ["Создайте ИИ-агента для анализа документов и извлечения ключевой информации", "Разработайте чат-бота для обработки клиентских запросов с использованием NLP", "Настройте модель машинного обучения для прогнозирования трендов продаж", "Интегрируйте API для обработки естественного языка в существующую систему", "Создайте автоматизированную систему классификации и тегирования контента", "Разработайте рекомендательную систему на основе поведения пользователей"];
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; text: string; isLoading?: boolean }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt(prev => (prev + 1) % examplePrompts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string) => {
    const prompt = text.trim();
    if (!prompt || isLoading) return;
    
    setIsLoading(true);
    
    // Add user message immediately
    const userMsg = { id: Math.random().toString(36).slice(2), role: 'user' as const, text: prompt };
    const loadingMsgId = Math.random().toString(36).slice(2);
    const loadingMsg = { id: loadingMsgId, role: 'assistant' as const, text: '...', isLoading: true };
    
    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setInput("");
    
    try {
      // Convert messages to format expected by AI service
      const chatMessages: Array<{role: 'user' | 'assistant' | 'system'; content: string}> = [
        ...messages.filter(m => !m.isLoading).map(m => ({
          role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.text,
        })),
        { role: 'user' as const, content: prompt },
      ];
      
      // Call AI service
      const response = await sendChatMessage(chatMessages, {
        model: import.meta.env.VITE_AI_MODEL || 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 1000,
        systemPrompt: 'Ты полезный AI ассистент для платформы QC AI-HUB Enterprise Platform. Отвечай на русском языке профессионально и дружелюбно.',
      });
      
      // Replace loading message with actual response
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMsgId 
          ? { id: loadingMsgId, role: 'assistant' as const, text: response.content }
          : msg
      ));
      
      // Save to history
      try {
        const ls = JSON.parse(localStorage.getItem('dashboard.history') || '[]');
        ls.unshift({ text: prompt, time: new Date().toISOString(), type: 'chat', model: response.model || 'AI' });
        localStorage.setItem('dashboard.history', JSON.stringify(ls.slice(0, 100)));
      } catch {}
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Replace loading message with error message
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMsgId 
          ? { id: loadingMsgId, role: 'assistant' as const, text: `Ошибка: ${error.message || 'Не удалось получить ответ от AI'}` }
          : msg
      ));
      
      showToast(error.message || 'Ошибка при отправке сообщения', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="flex flex-col h-full">
      <PageHeader />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0">
        {messages.length === 0 ? (
          // Начальное состояние: контент по центру вертикально
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 -mt-16">
            <div className="w-full max-w-3xl">
              <h2 className="text-4xl font-bold text-center mb-8">{t('dashboard.title')}</h2>

              {/* Central Input - по центру страницы */}
              <div className="relative mb-8">
                <ChatComposer
                  value={input}
                  onChange={setInput}
                  onSend={handleSend}
                  examples={examplePrompts}
                  disabled={isLoading}
                />
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full mx-auto items-stretch">
                <Card onClick={() => navigate('/ai-studio-chat', { state: { agent: 'KazDoc AI', placeholder: 'Задайте вопрос по документам' } })} className="bg-card border-border cursor-pointer transition hover:bg-muted/50 h-full">
                  <CardContent className="py-3 px-4 h-full">
                    <div className="flex items-center gap-3 h-full">
                      <div className="p-2 rounded-md bg-primary/10 text-primary flex-shrink-0">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-medium text-left">{t('dashboard.documents.title')}</CardTitle>
                        <CardDescription className="text-xs text-left">
                          {t('dashboard.documents.desc')}
                        </CardDescription>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card onClick={() => navigate('/ai-studio-chat', { state: { agent: 'QazAssistant Pro', placeholder: 'Опишите задачу для чат-бота' } })} className="bg-card border-border cursor-pointer transition hover:bg-muted/50 h-full">
                  <CardContent className="py-3 px-4 h-full">
                    <div className="flex items-center gap-3 h-full">
                      <div className="p-2 rounded-md bg-primary/10 text-primary flex-shrink-0">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-medium text-left">{t('dashboard.bots.title')}</CardTitle>
                        <CardDescription className="text-xs text-left">
                          {t('dashboard.bots.desc')}
                        </CardDescription>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card onClick={() => navigate('/ai-studio-chat', { state: { agent: 'KazCode Assistant', placeholder: 'Что требуется разработать?' } })} className="bg-card border-border cursor-pointer transition hover:bg-muted/50 h-full">
                  <CardContent className="py-3 px-4 h-full">
                    <div className="flex items-center gap-3 h-full">
                      <div className="p-2 rounded-md bg-primary/10 text-primary flex-shrink-0">
                        <Settings className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
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
          </div>
        ) : (
          // После отправки: сообщения сверху, поле ввода внизу
          <>
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-6">
                <div className="w-full max-w-3xl mx-auto">
                  <h2 className="text-4xl font-bold text-center mb-8">{t('dashboard.title')}</h2>

                  {/* Messages Display */}
                  <div className="space-y-4 mb-8">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <MessageBubble
                          text={msg.text}
                          role={msg.role}
                          messageId={msg.id}
                          isLoading={msg.isLoading}
                          onCopy={(text) => {
                            navigator.clipboard.writeText(text);
                            showToast('Скопировано в буфер обмена', 'success');
                          }}
                        />
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Input at bottom when messages exist */}
            <div className="p-4 bg-background">
              <div className="w-full max-w-3xl mx-auto">
                <ChatComposer
                  value={input}
                  onChange={setInput}
                  onSend={handleSend}
                  examples={examplePrompts}
                  disabled={isLoading}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>;
}