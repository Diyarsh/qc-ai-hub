import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, FileText, Languages, Code, BarChart3, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChatComposer } from "@/components/ChatComposer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendChatMessage } from "@/shared/services/ai.service.ts";
import { useToast } from "@/shared/components/Toast";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { Disclaimer } from "@/components/chat/Disclaimer";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type AgentCategory = "all" | "language" | "assistant" | "documents" | "code" | "industrial";
type AgentType = "agent" | "developer";

interface QuickAgent {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  instructions: string;
  placeholder: string;
  category?: AgentCategory[];
  type?: AgentType;
  tags?: string[];
  isLocal?: boolean;
  featured?: boolean;
  gradient?: string;
}

// Quick access agents from AI Studio
const quickAgents: QuickAgent[] = [
  {
    id: "LLM-Ultra",
    name: "LLM-Ultra",
    description: "Суверенная модель для корпоративного сектора",
    icon: Sparkles,
    instructions: "Высокоточная многоязычная модель для корпоративных задач.",
    placeholder: "Сформируй краткую сводку по рынку",
    category: ["language"],
    type: "agent",
    tags: ["Казахский", "Русский", "Английский"],
    isLocal: true,
  },
  {
    id: "Doc AI",
    name: "Doc AI",
    description: "Анализ и извлечение данных из документов",
    icon: FileText,
    instructions: "Анализ документов РК. Извлекай ключевые положения.",
    placeholder: "Извлеки ключевые требования из договора",
    category: ["documents"],
    type: "agent",
    tags: ["Госдокументы", "Правовые акты"],
    isLocal: true,
  },
  {
    id: "Translation Master",
    name: "Translation Master",
    description: "Профессиональный переводчик",
    icon: Languages,
    instructions: "Профессиональный переводчик с множеством языков.",
    placeholder: "Переведи текст на казахский",
    category: ["language"],
    type: "agent",
    tags: ["Перевод", "Многоязычность"],
    isLocal: true,
  },
  {
    id: "Code Assistant",
    name: "Code Assistant",
    description: "Помощник программиста",
    icon: Code,
    instructions: "Инженер-программист. Пиши код с комментариями.",
    placeholder: "Напиши функцию на TypeScript",
    category: ["code"],
    type: "agent",
    tags: ["Программирование", "Код"],
    isLocal: true,
  },
  {
    id: "Data Analyst",
    name: "Data Analyst",
    description: "Анализ данных и бизнес-метрик",
    icon: BarChart3,
    instructions: "Аналитик данных. Анализируй и визуализируй.",
    placeholder: "Проанализируй продажи за квартал",
    category: ["assistant"],
    type: "agent",
    tags: ["Аналитика", "Данные"],
    isLocal: true,
  },
];
export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const examplePrompts = ["Создайте ИИ-агента для анализа документов и извлечения ключевой информации", "Разработайте чат-бота для обработки клиентских запросов с использованием NLP", "Настройте модель машинного обучения для прогнозирования трендов продаж", "Интегрируйте API для обработки естественного языка в существующую систему", "Создайте автоматизированную систему классификации и тегирования контента", "Разработайте рекомендательную систему на основе поведения пользователей"];
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; text: string; isLoading?: boolean; feedback?: 'correct' | 'partially-correct' | 'incorrect'; feedbackDetails?: string; isRegenerated?: boolean }[]>([]);
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

  // Handle copy message text (callback for MessageBubble, no toast needed)
  const handleCopy = useCallback((messageId: string) => {
    // MessageBubble handles copying and visual feedback internally
    // This callback is kept for compatibility but doesn't need to do anything
  }, []);

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
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-6 pb-0">
            <div className="w-full max-w-3xl mx-auto">
        {messages.length === 0 ? (
          // Начальное состояние: контент по центру вертикально
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-8">
                  <h2 className="text-4xl font-semibold text-center mb-8">AI-HUB</h2>

              {/* Central Input - по центру страницы */}
                  <div className="relative mb-8 w-full">
                <ChatComposer
                  value={input}
                  onChange={setInput}
                  onSend={handleSend}
                  examples={examplePrompts}
                  disabled={isLoading}
                />
              </div>

                  {/* Quick Access Agent Cards - Static */}
                  <div className="w-full">
                    <div className="flex flex-wrap justify-center gap-3">
                      {quickAgents.map((agent) => {
                        const Icon = agent.icon;
                        return (
                          <Card 
                            key={agent.id}
                            onClick={() => navigate('/ai-studio-3-chat', { 
                              state: { 
                                agent: agent.name, 
                                instructions: agent.instructions,
                                placeholder: agent.placeholder 
                              } 
                            })} 
                            className="card-glow bg-card border-border cursor-pointer transition-all hover:bg-muted/50 hover:scale-[1.02] hover:shadow-lg group flex-shrink-0 w-[140px] h-[90px] relative"
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
                                <CardTitle className="text-[11px] font-medium group-hover:text-primary transition-colors truncate w-full">
                                  {agent.name}
                                </CardTitle>
                                <CardDescription className="text-[9px] leading-tight mt-0.5 line-clamp-1 truncate w-full">
                                  {agent.description}
                        </CardDescription>
                    </div>
                  </CardContent>
                </Card>
                        );
                      })}
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
                // После отправки: сообщения сверху, поле ввода внизу (фиксировано)
          <>
                  <h2 className="text-4xl font-semibold text-center mb-8 pt-4">AI-HUB</h2>

                  {/* Messages Display */}
                  <div className="space-y-4 pb-0">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={msg.role === 'user' ? 'flex justify-end' : ''}
                      >
                        <MessageBubble
                          text={msg.text}
                          role={msg.role}
                          messageId={msg.id}
                          isLoading={msg.isLoading}
                          feedback={msg.feedback}
                          feedbackDetails={msg.feedbackDetails}
                          onCopy={msg.role === 'assistant' ? () => handleCopy(msg.id) : undefined}
                          onFeedbackChange={(value, reasons, details) => {
                            if (msg.role !== 'assistant') return;
                            setMessages(prev => prev.map(m => 
                              m.id === msg.id 
                                ? { 
                                    ...m, 
                                    feedback: value || undefined,
                                    feedbackDetails: details || ""
                                  } 
                                : m
                            ));
                          }}
                        />
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </>
              )}
                </div>
              </ScrollArea>
            </div>

        {/* Input at bottom - только когда есть сообщения */}
        {messages.length > 0 && (
          <div className="sticky bottom-0 px-4 pb-4 pt-0 z-10 bg-background/95 backdrop-blur-sm relative before:absolute before:inset-x-0 before:-top-8 before:h-8 before:bg-gradient-to-t before:from-background/95 before:to-transparent before:backdrop-blur-sm before:pointer-events-none">
            <div className="w-full max-w-3xl mx-auto space-y-2">
                <ChatComposer
                  value={input}
                  onChange={setInput}
                  onSend={handleSend}
                  examples={examplePrompts}
                  disabled={isLoading}
                />
              <div className="pb-1">
                <Disclaimer />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>;
}