import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, FileText, Languages, Code, Briefcase, BarChart3, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChatComposer } from "@/components/ChatComposer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendChatMessage } from "@/shared/services/ai.service.ts";
import { useToast } from "@/shared/components/Toast";
import { MessageBubble } from "@/components/chat/MessageBubble";

// Quick access agents from AI Studio
const quickAgents = [
  {
    id: "LLM-Ultra",
    name: "LLM-Ultra",
    description: "Суверенная модель для корпоративного сектора",
    icon: Brain,
    instructions: "Высокоточная многоязычная модель для корпоративных задач.",
    placeholder: "Сформируй краткую сводку по рынку",
  },
  {
    id: "Doc AI",
    name: "Doc AI",
    description: "Анализ и извлечение данных из документов",
    icon: FileText,
    instructions: "Анализ документов РК. Извлекай ключевые положения.",
    placeholder: "Извлеки ключевые требования из договора",
  },
  {
    id: "Translation Master",
    name: "Translation Master",
    description: "Профессиональный переводчик",
    icon: Languages,
    instructions: "Профессиональный переводчик с множеством языков.",
    placeholder: "Переведи текст на казахский",
  },
  {
    id: "Code Assistant",
    name: "Code Assistant",
    description: "Помощник программиста",
    icon: Code,
    instructions: "Инженер-программист. Пиши код с комментариями.",
    placeholder: "Напиши функцию на TypeScript",
  },
  {
    id: "Data Analyst",
    name: "Data Analyst",
    description: "Анализ данных и бизнес-метрик",
    icon: BarChart3,
    instructions: "Аналитик данных. Анализируй и визуализируй.",
    placeholder: "Проанализируй продажи за квартал",
  },
  {
    id: "Assistant Pro",
    name: "Assistant Pro",
    description: "Корпоративный ассистент",
    icon: Briefcase,
    instructions: "Корпоративный ассистент для предприятий.",
    placeholder: "Составь шаблон онбординга",
  },
];
export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const examplePrompts = ["Создайте ИИ-агента для анализа документов и извлечения ключевой информации", "Разработайте чат-бота для обработки клиентских запросов с использованием NLP", "Настройте модель машинного обучения для прогнозирования трендов продаж", "Интегрируйте API для обработки естественного языка в существующую систему", "Создайте автоматизированную систему классификации и тегирования контента", "Разработайте рекомендательную систему на основе поведения пользователей"];
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; text: string; isLoading?: boolean; feedback?: 'like' | 'dislike' }[]>([]);
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

  const handleNewChat = useCallback(() => {
    // Save current chat to history if there are messages
    if (messages.length > 0) {
      const firstUserMessage = messages.find(m => m.role === 'user');
      if (firstUserMessage) {
        try {
          const ls = JSON.parse(localStorage.getItem('dashboard.history') || '[]');
          ls.unshift({ text: firstUserMessage.text, time: '2 часа назад', type: 'chat', model: 'AI' });
          localStorage.setItem('dashboard.history', JSON.stringify(ls.slice(0, 100)));
          window.dispatchEvent(new CustomEvent('dashboard.history.updated'));
        } catch {}
      }
    }
    // Clear current chat
    setMessages([]);
    setInput("");
  }, [messages]);

  // Listen for new chat event from sidebar
  useEffect(() => {
    const handleNewChatEvent = () => {
      handleNewChat();
    };

    window.addEventListener('dashboard.new-chat', handleNewChatEvent);
    return () => {
      window.removeEventListener('dashboard.new-chat', handleNewChatEvent);
    };
  }, [handleNewChat]);

  const handleSend = async (text: string) => {
    const prompt = text.trim();
    if (!prompt || isLoading) return;
    
    // Check if this is a new chat (no messages yet)
    const isNewChat = messages.length === 0;
    
    setIsLoading(true);
    
    // Add user message immediately
    const userMsg = { id: Math.random().toString(36).slice(2), role: 'user' as const, text: prompt };
    const loadingMsgId = Math.random().toString(36).slice(2);
    const loadingMsg = { id: loadingMsgId, role: 'assistant' as const, text: '...', isLoading: true };
    
    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setInput("");
    
    // Save to history immediately when first message is sent in a new chat
    if (isNewChat) {
      try {
        const ls = JSON.parse(localStorage.getItem('dashboard.history') || '[]');
        ls.unshift({ text: prompt, time: '2 часа назад', type: 'chat', model: 'AI' });
        localStorage.setItem('dashboard.history', JSON.stringify(ls.slice(0, 100)));
        window.dispatchEvent(new CustomEvent('dashboard.history.updated'));
      } catch {}
    }
    
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
              <h2 className="text-4xl font-bold text-center mb-8">AI-HUB</h2>

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

              {/* Quick Access Agent Cards - Marquee */}
              <div className="relative w-full overflow-hidden">
                <div className="flex animate-marquee gap-3">
                  {[...quickAgents, ...quickAgents].map((agent, index) => {
                    const Icon = agent.icon;
                    return (
                      <Card 
                        key={`${agent.id}-${index}`}
                        onClick={() => navigate('/ai-studio-3-chat', { 
                          state: { 
                            agent: agent.name, 
                            instructions: agent.instructions,
                            placeholder: agent.placeholder 
                          } 
                        })} 
                        className="card-glow bg-card border-border cursor-pointer transition-all hover:bg-muted/50 hover:scale-[1.02] hover:shadow-lg group flex-shrink-0 w-[140px] h-[90px]"
                        style={{ borderRadius: '16px' }}
                      >
                        <CardContent className="p-2.5 h-full flex flex-col items-center justify-center gap-1.5 text-center overflow-hidden">
                          <div 
                            className="p-1.5 bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 flex-shrink-0"
                            style={{ borderRadius: '10px' }}
                          >
                            <Icon className="h-4 w-4" />
                      </div>
                          <div className="min-w-0 w-full overflow-hidden">
                            <CardTitle className="text-[11px] font-medium group-hover:text-primary transition-colors truncate">{agent.name}</CardTitle>
                            <CardDescription className="text-[9px] leading-tight mt-0.5 line-clamp-1 truncate">
                              {agent.description}
                        </CardDescription>
                    </div>
                  </CardContent>
                </Card>
                    );
                  })}
                      </div>
                    </div>

              {/* View all agents link */}
              <div className="text-center mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/ai-studio-3')}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Все агенты AI Studio
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // После отправки: сообщения сверху, поле ввода внизу
          <>
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-6">
                <div className="w-full max-w-3xl mx-auto">
                  <h2 className="text-4xl font-bold text-center mb-8">AI-HUB</h2>

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
                          feedback={msg.feedback}
                          onFeedbackChange={(value) => {
                            if (msg.role !== 'assistant') return;
                            setMessages(prev => prev.map(m => 
                              m.id === msg.id ? { ...m, feedback: value || undefined } : m
                            ));
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