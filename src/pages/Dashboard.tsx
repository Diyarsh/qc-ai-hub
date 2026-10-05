import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, FileText, Languages, Code, BarChart3, Plus, X, File, Mic, FileCheck, CircleHelp, MessageCircle, Paperclip, ListChecks } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChatComposer } from "@/components/ChatComposer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/shared/components/Toast";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { formatChatDateLabel, getDayKey } from "@/lib/chat-time";
import { Disclaimer } from "@/components/chat/Disclaimer";
import { FileDropOverlay } from "@/components/chat/FileDropOverlay";
import { Modal } from "@/shared/components/Modal";
import { FileUpload } from "@/shared/components/Forms/FileUpload";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import aiHubSkLogo from "@/assets/logo-ai-hub-sk.svg";
import skaiLogotype from "@/assets/SKAI Logotype.svg";
import { createDashboardChat, loadDashboardChat, saveDashboardChat, type DashboardMessage } from "@/services/dashboard-chat";
import { getAgentOnboarding } from "@/data/agent-onboarding";


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
  iconColor?: string;
}

// Quick access agents from AI Studio
const quickAgents: QuickAgent[] = [
  {
    id: "Transcriber",
    name: "Транскрибатор",
    description: "Преобразование аудио и видео в текст",
    icon: Mic,
    instructions: "Специалист по транскрибации. Преобразуй аудио и видео записи в точный текст, сохраняя структуру и пунктуацию.",
    placeholder: "Расшифруй прикрепленную аудиозапись",
    category: ["documents"],
    type: "agent",
    tags: ["Аудио", "Видео"],
    isLocal: true,
    gradient: "from-primary/20 via-primary/10 to-transparent",
    iconColor: "text-primary",
  },
  {
    id: "Summarizer",
    name: "Суммаризатор",
    description: "Автоматическое создание кратких сводок из текстов",
    icon: FileCheck,
    instructions: "Специалист по суммаризации текстов. Создавай краткие и информативные сводки, выделяй ключевые моменты и основные выводы.",
    placeholder: "Создай краткую сводку из прикрепленного документа",
    category: ["documents"],
    type: "agent",
    tags: ["Документы", "Анализ"],
    isLocal: true,
    featured: true,
    gradient: "from-primary/20 via-primary/10 to-transparent",
    iconColor: "text-primary",
  },
  {
    id: "Translation Master",
    name: "Translation Master",
    description: "Профессиональный переводчик с поддержкой множества языков",
    icon: Languages,
    instructions: "Профессиональный переводчик. Обеспечивай точный перевод с сохранением контекста и стиля оригинала.",
    placeholder: "Переведи техническую документацию с английского на казахский",
    category: ["language"],
    type: "agent",
    tags: ["Казахский", "Русский", "Английский", "+15 языков"],
    isLocal: true,
    gradient: "from-primary/20 via-primary/10 to-transparent",
    iconColor: "text-primary",
  },
];
export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const examplePrompts = ["Создайте ИИ-агента для анализа документов и извлечения ключевой информации", "Разработайте чат-бота для обработки клиентских запросов с использованием NLP", "Настройте модель машинного обучения для прогнозирования трендов продаж", "Интегрируйте API для обработки естественного языка в существующую систему", "Создайте автоматизированную систему классификации и тегирования контента", "Разработайте рекомендательную систему на основе поведения пользователей"];
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [initialChat] = useState(() => loadDashboardChat(new URLSearchParams(location.search).get("chat")) || createDashboardChat());
  const [chatId, setChatId] = useState(initialChat.id);
  const [input, setInput] = useState(initialChat.draft);
  const [messages, setMessages] = useState<DashboardMessage[]>(initialChat.messages);
  const [onboardingOpen, setOnboardingOpen] = useState(() => initialChat.messages.length === 0 && !localStorage.getItem("aihub.onboarding.general-chat"));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const demoTimerRef = useRef<number | null>(null);

  const dismissOnboarding = useCallback(() => {
    localStorage.setItem("aihub.onboarding.general-chat", "complete");
    setOnboardingOpen(false);
  }, []);

  useEffect(() => {
    const requestedId = new URLSearchParams(location.search).get("chat");
    if (!requestedId) return;
    const saved = loadDashboardChat(requestedId);
    if (!saved || saved.id === chatId) return;
    if (demoTimerRef.current !== null) window.clearTimeout(demoTimerRef.current);
    setIsLoading(false);
    setChatId(saved.id);
    setMessages(saved.messages);
    setInput(saved.draft);
    setAttachedFiles([]);
    setOnboardingOpen(false);
  }, [location.search]);

  useEffect(() => {
    saveDashboardChat({ id: chatId, messages, draft: input });
  }, [chatId, messages, input]);

  useEffect(() => () => {
    if (demoTimerRef.current !== null) window.clearTimeout(demoTimerRef.current);
  }, []);
  
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
    if (demoTimerRef.current !== null) window.clearTimeout(demoTimerRef.current);
    const next = createDashboardChat();
    saveDashboardChat(next);
    setChatId(next.id);
    setMessages([]);
    setInput("");
    setAttachedFiles([]);
    setIsLoading(false);
    setIsAttachModalOpen(false);
    dismissOnboarding();
    navigate("/dashboard", { replace: true });
  }, [dismissOnboarding, navigate]);

  // Handle copy message text (callback for MessageBubble, no toast needed)
  const handleCopy = useCallback((messageId: string) => {
    // MessageBubble handles copying and visual feedback internally
    // This callback is kept for compatibility but doesn't need to do anything
  }, []);

  const handleStop = useCallback(() => {
    if (demoTimerRef.current !== null) window.clearTimeout(demoTimerRef.current);
    setIsLoading(false);
    // Replace loading message with stopped message
    setMessages(prev => prev.map(msg => 
      msg.isLoading ? { ...msg, text: 'Генерация остановлена', isLoading: false } : msg
    ));
  }, []);

  const handleSend = (text: string) => {
    const prompt = text.trim();
    if ((!prompt && attachedFiles.length === 0) || isLoading) return;
    dismissOnboarding();
    const displayText = prompt || `Прикреплено ${attachedFiles.length} файл(ов)`;
    const now = new Date().toISOString();
    const responseId = crypto.randomUUID();
    setMessages(current => [...current,
      { id: crypto.randomUUID(), role: "user", text: displayText, files: attachedFiles.map(file => ({ name: file.name, type: file.type })), createdAt: now },
      { id: responseId, role: "assistant", text: "", isLoading: true, createdAt: now },
    ]);
    setIsLoading(true);
    setInput("");
    setAttachedFiles([]);
    // Local responses keep this product-design prototype independent of an AI service.
    demoTimerRef.current = window.setTimeout(() => {
      const response = prompt === getAgentOnboarding("AI-HUB-Agent")!.examples[0].prompt
        ? getAgentOnboarding("AI-HUB-Agent")!.demo
        : `## План работы\n\n**Ваша задача:** ${displayText}\n\n1. Уточнить исходные данные и ожидаемый результат.\n2. Подготовить первый вариант и выделить ключевые пункты.\n3. Проверить детали и скорректировать результат.\n\nМожно уточнить запрос: «Сократи ответ», «Оформи таблицей» или «Добавь следующий шаг».`;
      setMessages(current => current.map(message => message.id === responseId
        ? { ...message, text: response, isLoading: false, createdAt: new Date().toISOString() }
        : message));
      setIsLoading(false);
      demoTimerRef.current = null;
    }, 700);
  };

  return <div className="flex flex-col h-full">
      <PageHeader title="Чат" subtitle={messages.length ? messages.find(message => message.role === "user")?.text : "Новый диалог"} actions={
        <>
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setOnboardingOpen(true)}><CircleHelp className="h-4 w-4" /><span className="hidden sm:inline">Как пользоваться</span></Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleNewChat}><Plus className="h-4 w-4" />Новый чат</Button>
        </>
      } />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 relative">
        {onboardingOpen && (
          <section aria-label="Знакомство с чатом" className="relative z-20 mx-auto mt-5 w-[calc(100%-32px)] max-w-3xl rounded-2xl border border-primary/20 bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-xs font-medium text-primary">Ваш первый шаг</p><h2 className="mt-1 text-lg font-semibold">Начните с одной рабочей задачи</h2><p className="mt-1 text-sm text-muted-foreground">Помощник подготовит первый вариант — его можно уточнять в этом же диалоге.</p></div>
              <button aria-label="Закрыть знакомство с чатом" onClick={dismissOnboarding} className="rounded-lg p-1 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { icon: MessageCircle, title: "Опишите задачу", text: "Что нужно сделать и для кого." },
                { icon: Paperclip, title: "Добавьте материалы", text: "Прикрепите файл, если он нужен." },
                { icon: ListChecks, title: "Уточните результат", text: "Укажите формат, объём и тон." },
              ].map(item => <div key={item.title} className="rounded-xl bg-muted/50 p-3"><item.icon className="mb-2 h-4 w-4 text-primary" /><p className="text-xs font-semibold">{item.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{item.text}</p></div>)}
            </div>
            <div className="mt-4 flex flex-wrap gap-2"><Button size="sm" onClick={() => handleSend(getAgentOnboarding("AI-HUB-Agent")!.examples[0].prompt)}>Попробовать пример</Button><Button variant="ghost" size="sm" onClick={dismissOnboarding}>Начать самостоятельно</Button></div>
          </section>
        )}
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl animate-breathe" />
          <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-accent/6 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '4s' }} />
        </div>
        <div className="flex-1 overflow-hidden relative z-10">
          <ScrollArea className="h-full p-6 pb-0">
            <div className="w-full max-w-3xl mx-auto flex flex-col min-h-[calc(100vh-68px-48px)]">
        {messages.length === 0 ? (
          // Начальное состояние: контент по центру вертикально
                <div className="flex flex-col items-center justify-center flex-1 py-8">
                  <img
                    src={skaiLogotype}
                    alt="SKAI"
                    className="mb-4 h-24"
                  />
                  <h2 className="mb-2 text-2xl font-semibold">Чем помочь?</h2>
                  <p className="mb-6 text-center text-sm text-muted-foreground">Начните новую задачу или выберите диалог в истории.</p>
                   

              {/* Central Input - по центру страницы */}
                  <div className="relative mb-8 w-full space-y-2">
                {attachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {attachedFiles.map((file, index) => (
                      <Badge key={index} variant="default" className="flex items-center gap-2 px-2 py-1">
                        <File className="h-3 w-3" />
                        <span className="text-xs max-w-[150px] truncate">{file.name}</span>
                        <button
                          onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== index))}
                          className="ml-1 hover:opacity-70"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <ChatComposer
                  value={input}
                  onChange={setInput}
                  onSend={handleSend}
                  onAttachClick={() => setIsAttachModalOpen(true)}
                  onStop={handleStop}
                  examples={examplePrompts}
                  disabled={isLoading}
                  isLoading={isLoading}
                  canSendWithoutText={attachedFiles.length > 0}
                />
              </div>

                  {/* Quick Access Agent Cards - Static */}
                  <div className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 max-w-2xl mx-auto justify-items-center">
                      {quickAgents.map((agent, index) => {
                        const Icon = agent.icon;
                        return (
                          <Card 
                            key={agent.id}
                            onClick={() => {
                              if (agent.id === "Translation Master") {
                                navigate("/agents/translator");
                                return;
                              }
                              navigate('/ai-studio-3-chat', { 
                              state: { 
                                agent: agent.name, 
                                agentId: agent.id,
                                instructions: agent.instructions,
                                placeholder: agent.placeholder 
                              } 
                            });
                            }} 
                            className={cn(
                              "card-glow relative overflow-hidden transition-all duration-300 cursor-pointer group",
                              "bg-card/60 backdrop-blur-sm border-border/30",
                              "hover:scale-[1.04] hover:shadow-xl hover:shadow-primary/10",
                              "w-full max-w-[200px]"
                            )}
                            style={{
                              borderRadius: '16px',
                              height: '100px',
                            }}
                          >
                            {/* Always-visible gradient background */}
                            {agent.gradient && (
                              <div className={cn(
                                "absolute inset-0 bg-gradient-to-br transition-opacity duration-300",
                                agent.gradient,
                                "opacity-40 group-hover:opacity-80"
                              )} 
                              style={{ borderRadius: '16px' }}
                              />
                            )}
                            {/* Top accent line */}
                            <div className="absolute top-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent group-hover:via-primary/70 transition-all duration-300" />
                            
                            <CardHeader className="p-3 relative z-10 h-full flex items-center justify-center">
                              <div className="flex flex-col items-center justify-center gap-2">
                                <div className="relative flex-shrink-0 transition-all duration-500 flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-0.5">
                                  <div className="absolute inset-0 rounded-full bg-primary/10 blur-md scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                  <Icon className={cn("h-8 w-8 relative z-10", agent.iconColor || "text-primary")} style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.2))' }} />
                                </div>
                                <CardTitle className="text-xs font-semibold text-center group-hover:text-primary transition-colors">
                                  {agent.name}
                                </CardTitle>
                              </div>
                            </CardHeader>
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
                  <div className="flex items-center gap-3 mb-8 pt-4">
                    <img src={aiHubSkLogo} alt="AI-HUB" className="h-8 w-8" />
                    <span className="text-sm text-muted-foreground">Диалог сохранён · можно продолжить с этого места</span>
                  </div>

                  {/* Messages Display */}
                  <div className="space-y-4 pb-24">
                    {messages.map((msg, index) => {
                      const dayKey = msg.createdAt ? getDayKey(msg.createdAt) : "";
                      const prevDayKey =
                        index > 0 && messages[index - 1].createdAt
                          ? getDayKey(messages[index - 1].createdAt!)
                          : "";
                      const showDate = Boolean(dayKey && dayKey !== prevDayKey);

                      return (
                        <div key={msg.id}>
                          {showDate && msg.createdAt && (
                            <div className="flex justify-center my-3">
                              <span className="text-[11px] font-medium text-muted-foreground/80 px-2.5 py-1 rounded-full bg-muted/70">
                                {formatChatDateLabel(msg.createdAt)}
                              </span>
                            </div>
                          )}
                          <div className={msg.role === 'user' ? 'flex justify-end' : ''}>
                            <MessageBubble
                              text={msg.text}
                              role={msg.role}
                              messageId={msg.id}
                              isLoading={msg.isLoading}
                              createdAt={msg.createdAt}
                              files={msg.files?.map(f => ({ name: f.name, type: f.type }))}
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
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </>
              )}
                </div>
              </ScrollArea>
            </div>

        {/* Input at bottom - только когда есть сообщения */}
        {messages.length > 0 && (
          <div className="sticky bottom-0 px-4 pb-4 pt-8 z-10 bg-background/95 backdrop-blur-sm border-t border-border/60 relative before:absolute before:inset-x-0 before:-top-8 before:h-8 before:bg-gradient-to-t before:from-background/95 before:to-transparent before:backdrop-blur-sm before:pointer-events-none">
            <div className="w-full max-w-3xl mx-auto space-y-2">
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {attachedFiles.map((file, index) => (
                    <Badge key={index} variant="default" className="flex items-center gap-2 px-2 py-1">
                      <File className="h-3 w-3" />
                      <span className="text-xs max-w-[150px] truncate">{file.name}</span>
                      <button
                        onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== index))}
                        className="ml-1 hover:opacity-70"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
                <ChatComposer
                  value={input}
                  onChange={setInput}
                  onSend={handleSend}
                  onAttachClick={() => setIsAttachModalOpen(true)}
                  onStop={handleStop}
                  examples={examplePrompts}
                  disabled={isLoading}
                  isLoading={isLoading}
                  canSendWithoutText={attachedFiles.length > 0}
                />
              <div className="pb-1">
                <Disclaimer />
              </div>
            </div>
          </div>
        )}
      </main>

      <FileDropOverlay
        onFilesDropped={(files) => setAttachedFiles(prev => [...prev, ...files])}
        enabled={!isLoading}
      />

      <Modal
        isOpen={isAttachModalOpen}
        onClose={() => setIsAttachModalOpen(false)}
        title="Прикрепить файлы"
        size="md"
      >
        <FileUpload
          key={isAttachModalOpen ? "open" : "closed"}
          onFilesSelected={(files) => {
            setAttachedFiles(prev => [...prev, ...files]);
            setIsAttachModalOpen(false);
          }}
          acceptedTypes={[".pdf", ".docx", ".doc", ".txt", ".md", ".csv", ".xlsx", ".xls", ".png", ".jpg", ".jpeg"]}
          multiple={true}
          maxSizeMB={50}
        />
      </Modal>
    </div>;
}
