import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  File,
  FileDown,
  Sparkles,
  X,
  CircleHelp,
  MousePointer2,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChatComposer } from "@/components/ChatComposer";
import { Modal } from "@/shared/components/Modal";
import { FileUpload } from "@/shared/components/Forms/FileUpload";
import { Badge } from "@/shared/components/Badge";
import { sendChatMessage } from "@/shared/services/ai.service.ts";
import { useToast } from "@/shared/components/Toast";
import { AgentHistorySidebar } from "@/components/AgentHistorySidebar";
import { AgentChatService } from "@/services/agent-chat.service";
import { AgentChatMessage } from "@/types/agent-chat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { formatChatDateLabel, getDayKey } from "@/lib/chat-time";
import { Disclaimer } from "@/components/chat/Disclaimer";
import { FileDropOverlay } from "@/components/chat/FileDropOverlay";
import { PresentationAgentPanel } from "@/components/presentation/PresentationAgentPanel";
import { TranslatorPlatform } from "@/components/translator/TranslatorPlatform";
import { TranslatorDocumentPlatform } from "@/components/translator/TranslatorDocumentPlatform";
import { AgentOnboarding } from "@/components/agent/AgentOnboarding";
import { AgentGuidedTour, type AgentTourStep } from "@/components/agent/AgentGuidedTour";
import { getAgentOnboarding, getAgentDemoFiles, isMediaAgent } from "@/data/agent-onboarding";

export interface AIStudio3ChatProps {
  /** Прямой вход по `/agents/presentation` без state из каталога */
  presentationMode?: boolean;
}

type ChatNavState = {
  agent?: string;
  agentId?: string;
  placeholder?: string;
  initialMessage?: string;
  sessionId?: string;
  instructions?: string;
};

type AttachmentKind = "file" | "audio" | "video";

type ChatAttachment = {
  name: string;
  size?: number;
  type?: string;
};

type ChatViewMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  files?: ChatAttachment[];
  isLoading?: boolean;
  durationMs?: number;
  feedback?: "correct" | "partially-correct" | "incorrect";
  feedbackReasons?: string[];
  feedbackDetails?: string;
  isRegenerated?: boolean;
  createdAt?: string;
};

const TRANSCRIBER_AUDIO_TYPES = [".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac"];
const TRANSCRIBER_VIDEO_TYPES = [".mp4", ".mov", ".mkv", ".webm", ".avi", ".m4v"];
const TRANSCRIBER_ALL_TYPES = [...TRANSCRIBER_AUDIO_TYPES, ...TRANSCRIBER_VIDEO_TYPES];

export default function AIStudio3Chat({
  presentationMode = false,
}: AIStudio3ChatProps = {}) {
  const {
    t
  } = useLanguage();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const navState = (location.state || {}) as ChatNavState;
  const storedAgent =
    typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem("aihub-last-agent")
      : null;
  const query = new URLSearchParams(location.search);
  const onboarding = presentationMode ? undefined : getAgentOnboarding(query.get("agent") || navState.agentId, navState.agent || storedAgent);
  const agent = presentationMode
    ? "Создатель презентаций"
    : onboarding?.name || navState.agent || storedAgent || undefined;

  useEffect(() => {
    if (navState.agent) {
      sessionStorage.setItem("aihub-last-agent", navState.agent);
    }
    if (navState.agentId) {
      sessionStorage.setItem("aihub-last-agent-id", navState.agentId);
    }
  }, [navState.agent, navState.agentId]);

  const placeholder =
    navState.placeholder ??
    (presentationMode || agent === "Создатель презентаций"
      ? "Обсуди структуру презентации или задай вопрос по брендингу…"
      : undefined);
  const initialMessage = navState.initialMessage;
  const storedAgentId =
    typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem("aihub-last-agent-id")
      : null;
  const isTranscriber = isMediaAgent(onboarding) ||
    navState.agentId === "Transcriber" ||
    agent === "Транскрибатор" ||
    (!onboarding && !navState.agent && storedAgentId === "Transcriber");
  const isPresentationAgent =
    presentationMode ||
    navState.agentId === "Presentation-Agent" ||
    agent === "Создатель презентаций";
  const isTranslatorAgent =
    navState.agentId === "Translator" ||
    navState.agentId === "Translator-2" ||
    agent === "Переводчик" ||
    agent === "Переводчик 2.0" ||
    agent === "Translation Master" ||
    agent === "Translator" ||
    (!onboarding && !navState.agent && storedAgentId === "Translator") ||
    (!onboarding && !navState.agent && storedAgentId === "Translator-2");

  // Переводчик — документный дашборд, не чат
  useEffect(() => {
    if (presentationMode) return;
    if (!isTranslatorAgent) return;
    const target =
      navState.agentId === "Translator-2" || agent === "Переводчик 2.0"
        ? "/agents/translator-2"
        : "/agents/translator";
    navigate(target, { replace: true });
  }, [isTranslatorAgent, navigate, presentationMode, navState.agentId, agent]);
  const [message, setMessage] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<ChatAttachment[]>([]);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [attachmentKind, setAttachmentKind] = useState<AttachmentKind>("file");
  const [messages, setMessages] = useState<ChatViewMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const demoTimerRef = useRef<number | null>(null);

  const closeTour = useCallback(() => {
    if (onboarding && tourStep === 3) {
      localStorage.setItem(`aihub.onboarding.${onboarding.id}`, "complete");
      setOnboardingComplete(true);
    }
    setTourStep(null);
  }, [onboarding, tourStep]);

  const startTour = useCallback(() => {
    if (onboarding) setTourStep(0);
  }, [onboarding]);

  useEffect(() => {
    setOnboardingComplete(Boolean(onboarding && localStorage.getItem(`aihub.onboarding.${onboarding.id}`)));
    setTourStep(query.get("tour") === "1" && onboarding ? 0 : null);
    setMessage("");
    setAttachedFiles([]);
    if (demoTimerRef.current !== null) window.clearTimeout(demoTimerRef.current);
    setIsLoading(false);
    if (!navState.sessionId) { setMessages([]); setCurrentSessionId(null); }
  }, [onboarding?.id, location.key]);

  useEffect(() => () => {
    if (demoTimerRef.current !== null) window.clearTimeout(demoTimerRef.current);
  }, []);
  
  const examplePrompts = isPresentationAgent
    ? [
        "Как улучшить структуру этой презентации для инвесторов?",
        "Что убрать или сократить для аудитории C-level?",
        "Подскажи формулировки в tone of voice выбранного бренда",
        "Как усилить блок про безопасность и compliance?",
      ]
    : onboarding?.examples.map(example => example.prompt) || ["Сформируй краткую сводку по рынку за Q3 2025", "Подготовь анализ конкурентов в сфере e-commerce", "Предложи 3 риск-фактора для проекта AI", "Составь план внедрения чата-бота в службу поддержки"];
  
  const loadSession = useCallback((sessionId: string) => {
    const savedMessages = AgentChatService.getMessages(sessionId);
    if (savedMessages.length > 0) {
      const convertedMessages = savedMessages.map(m => ({
        id: m.id,
        role: m.role,
        text: m.text,
        files: [], // Cannot restore File objects from localStorage
        isLoading: false,
        durationMs: m.durationMs,
        feedback: m.feedback,
        createdAt: m.createdAt,
      }));
      setMessages(convertedMessages);
      setCurrentSessionId(sessionId);
    }
  }, []);

  // Load sessions and messages on mount or when agent changes
  useEffect(() => {
    if (!agent) return;

    // Load sessions for this agent
    const sessions = AgentChatService.getSessions(agent);
    if (sessions.length === 0) {
      // Generate mock data if empty
      AgentChatService.generateMockSessions(agent);
    }

    // If there's a session in URL state, load it
    const sessionIdFromState = navState.sessionId;
    if (sessionIdFromState) {
      loadSession(sessionIdFromState);
    }
  }, [agent, navState.sessionId, loadSession]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /** Сессия для создателя презентаций — чтобы история сохранялась до первого сообщения в ленте */
  useEffect(() => {
    if (!isPresentationAgent || !agent) return;
    if (currentSessionId) return;
    const session = AgentChatService.createSession(agent, "Презентация");
    setCurrentSessionId(session.id);
  }, [isPresentationAgent, agent, currentSessionId]);

  // Save messages to localStorage when they change (debounced)
  useEffect(() => {
    if (!currentSessionId || messages.length === 0) return;

    const timeoutId = setTimeout(() => {
      const messagesToSave: AgentChatMessage[] = messages
        .filter(m => !m.isLoading)
        .map(m => ({
          id: m.id,
          role: m.role,
          text: m.text,
          files: m.files?.map(f => ({ name: f.name, size: f.size || 0 })),
          createdAt: m.createdAt || new Date().toISOString(),
          durationMs: m.durationMs,
          feedback: m.feedback,
        }));

      AgentChatService.saveMessages(currentSessionId, messagesToSave);

      // Update session metadata
      if (agent) {
        const lastUserMessage = messages.filter(m => m.role === 'user' && !m.isLoading).pop();
        if (lastUserMessage) {
          AgentChatService.updateSession(currentSessionId, agent, {
            lastMessage: lastUserMessage.text.slice(0, 100),
            messageCount: messagesToSave.length,
          });
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [messages, currentSessionId, agent]);

  const handleNewSession = () => {
    if (!agent) return;
    const newSession = AgentChatService.createSession(agent);
    setCurrentSessionId(newSession.id);
    setMessages([]);
    setMessage("");
    setAttachedFiles([]);
    setTourStep(null);
    if (demoTimerRef.current !== null) window.clearTimeout(demoTimerRef.current);
    setIsLoading(false);
  };

  const handleSessionSelect = (sessionId: string) => {
    loadSession(sessionId);
  };

  const openAttachmentPicker = useCallback((kind: AttachmentKind = "file") => {
    setAttachmentKind(kind);
    setIsAttachModalOpen(true);
  }, []);

  const getTranscriberAcceptedTypes = useCallback(() => {
    if (attachmentKind === "audio") return TRANSCRIBER_AUDIO_TYPES;
    if (attachmentKind === "video") return TRANSCRIBER_VIDEO_TYPES;
    return TRANSCRIBER_ALL_TYPES;
  }, [attachmentKind]);

  const showAgentDemo = useCallback(() => {
    if (!onboarding) return;
    const now = new Date().toISOString();

    if (!currentSessionId && agent) {
      const session = AgentChatService.createSession(agent, onboarding.examples[0].title);
      setCurrentSessionId(session.id);
    }

    setMessages([
      {
        id: `demo-user-${Date.now()}`,
        role: "user",
        text: onboarding.examples[0].prompt,
        files: onboarding.sourceFile ? [{ name: onboarding.sourceFile }] : [],
        createdAt: now,
      },
      {
        id: `demo-result-${Date.now()}`,
        role: "assistant",
        text: onboarding.demo,
        files: getAgentDemoFiles(onboarding),
        createdAt: new Date(Date.now() + 1000).toISOString(),
      },
    ]);
    setMessage("");
    setAttachedFiles([]);
    if (demoTimerRef.current !== null) window.clearTimeout(demoTimerRef.current);
    setIsLoading(false);
  }, [agent, currentSessionId, onboarding]);

  const appendPresentationMessages = useCallback(
    (items: { role: "user" | "assistant"; text: string }[]) => {
      const now = new Date().toISOString();
      setMessages((prev) => [
        ...prev,
        ...items.map((item) => ({
          ...item,
          id:
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : Math.random().toString(36).slice(2),
          createdAt: now,
        })),
      ]);
    },
    []
  );

  const handleExportReport = useCallback(() => {
    if (messages.length === 0) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

    // Collect user questions and assistant answers
    const userMessages = messages.filter(m => m.role === 'user' && !m.isLoading);
    const assistantMessages = messages.filter(m => m.role === 'assistant' && !m.isLoading);

    const question = userMessages.map(m => m.text).join('\n\n');
    const shortAnswer = assistantMessages.length > 0 ? assistantMessages[0].text.slice(0, 300) : '';
    const fullAnswer = assistantMessages.map(m => m.text).join('\n\n---\n\n');

    const report = `ЗАКЛЮЧЕНИЕ
ИИ-агента по правовому сопровождению деятельности АО «Самрук-Қазына»

г. Астана                                                           ${dateStr}

═══════════════════════════════════════════════════════════════

Агент:                    ${agent || 'AI-ассистент'}

Наименование вопроса:     ${question.slice(0, 200)}

───────────────────────────────────────────────────────────────

КРАТКИЙ ОТВЕТ:
${shortAnswer}

───────────────────────────────────────────────────────────────

ПОДРОБНЫЙ ОТВЕТ:
${fullAnswer}

───────────────────────────────────────────────────────────────

ИСТОЧНИКИ:
1. Источники НПА
2. Источники ВНД

───────────────────────────────────────────────────────────────

ВЫВОДЫ:
Проекты представленных документов по вопросу соответствуют нормам и требованиям
нормативных правовых актов Республики Казахстан и внутренних нормативных документов
АО «Самрук-Қазына»

═══════════════════════════════════════════════════════════════
Дата формирования: ${dateStr}
Сформировано автоматически платформой QC AI-HUB
`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Заключение_ИИ_${dateStr.replace(/\./g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Отчёт выгружен', 'success');
  }, [messages, agent, showToast]);

  // Handle copy message text (callback for MessageBubble, no toast needed)
  const handleCopy = useCallback((messageId: string) => {
    // MessageBubble handles copying and visual feedback internally
    // This callback is kept for compatibility but doesn't need to do anything
  }, []);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleStop = useCallback(() => {
    if (demoTimerRef.current !== null) window.clearTimeout(demoTimerRef.current);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setMessages(prev => prev.map(msg => 
      msg.isLoading ? { ...msg, text: 'Генерация остановлена', isLoading: false } : msg
    ));
  }, []);

  const handleSend = async (textOverride?: string) => {
    const text = (textOverride ?? message).trim();
    if ((!text && attachedFiles.length === 0) || isLoading) return;
    
    // Create or get current session
    if (!currentSessionId && agent) {
      // Создаем сессию с названием из первого сообщения (сокращаем до 35 символов)
      const firstMessage = text || `Прикреплено ${attachedFiles.length} файл(ов)`;
      const title = firstMessage.slice(0, 35).trim();
      const newSession = AgentChatService.createSession(agent, title || 'Новый чат');
      setCurrentSessionId(newSession.id);
    }
    
    setIsLoading(true);
    
    // Добавляем сообщение пользователя
    const nowIso = new Date().toISOString();
    const userMsg = {
      id: Math.random().toString(36).slice(2),
      role: 'user' as const,
      text: text || `Прикреплено ${attachedFiles.length} файл(ов)`,
      files: [...attachedFiles],
      createdAt: nowIso,
    };
    
    const loadingMsgId = Math.random().toString(36).slice(2);
    const loadingMsg = {
      id: loadingMsgId,
      role: 'assistant' as const,
      text: '',
      isLoading: true,
      createdAt: nowIso,
    };
    
    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setMessage("");
    setAttachedFiles([]);

    // Every configured onboarding scenario uses local sample data in this mockup.
    if (onboarding) {
      demoTimerRef.current = window.setTimeout(() => {
        setMessages(prev => prev.map(msg =>
          msg.id === loadingMsgId
            ? {
                id: loadingMsgId,
                role: "assistant",
                text: onboarding.demo,
                files: getAgentDemoFiles(onboarding),
                createdAt: new Date().toISOString(),
              }
            : msg
        ));
        setIsLoading(false);
        setTourStep(step => step === 2 ? 3 : step);
      }, 900);
      return;
    }
    
    try {
      const startedAt = performance.now();
      // Build detailed system prompt based on agent
      let systemPrompt = agent 
        ? `Ты ${agent} - профессиональный эксперт AI ассистент высокого уровня. 

ВАЖНО: Всегда давай РАЗВЁРНУТЫЕ, ДЕТАЛЬНЫЕ ответы минимум на 150-300 слов. Никогда не отвечай одним предложением.

Требования к ответам:
- Структурируй информацию с заголовками и подзаголовками (используй ** для выделения)
- Используй маркированные и нумерованные списки для лучшей читаемости
- Приводи конкретные примеры и практические рекомендации
- Объясняй концепции подробно, как эксперт в своей области
- Отвечай на русском языке профессионально и информативно
- Если вопрос короткий или простой, всё равно дай полный, развёрнутый ответ с контекстом и деталями`
        : `Ты полезный AI ассистент для платформы QC AI-HUB Enterprise Platform.

ВАЖНО: Всегда давай РАЗВЁРНУТЫЕ, ДЕТАЛЬНЫЕ ответы минимум на 150-300 слов. Никогда не отвечай одним предложением.

Требования к ответам:
- Структурируй информацию с заголовками и подзаголовками
- Используй маркированные и нумерованные списки
- Приводи конкретные примеры и рекомендации
- Отвечай на русском языке профессионально и дружелюбно
- Даже на простые вопросы давай полные, информативные ответы`;

      if (isPresentationAgent) {
        const instr = navState.instructions?.trim();
        systemPrompt = `${instr ? `${instr}\n\n` : ""}${systemPrompt}

Контекст Presentation Agent: пользователь формирует презентацию из документа в боковой панели (на широком экране справа; на узком экране — блок под подсказками). Готовые файлы PPTX и PDF он скачивает из панели после генерации. Твоя задача в чате — советовать по структуре слайдов, формулировкам, логике storytelling и соответствию корпоративному тону; не выдумывай конкретные цифры из документа, если их не было в переписке.`;
      }
      
      // Convert messages to format expected by AI service
      const chatMessages: Array<{role: 'user' | 'assistant' | 'system'; content: string}> = [
        ...messages.filter(m => !m.isLoading).map(m => ({
          role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.text + (m.files && m.files.length > 0 ? `\n\nПрикреплено файлов: ${m.files.map(f => f.name).join(', ')}` : ''),
        })),
        { role: 'user' as const, content: text || `Прикреплено ${attachedFiles.length} файл(ов)` },
      ];
      
      // Call AI service with higher token limit for detailed responses
      const response = await sendChatMessage(chatMessages, {
        model: import.meta.env.VITE_AI_MODEL || 'gpt-3.5-turbo',
        temperature: 0.8,
        maxTokens: 2000,
        systemPrompt,
      });
      const durationMs = performance.now() - startedAt;
      
      // Replace loading message with actual response
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMsgId 
          ? {
              id: loadingMsgId,
              role: 'assistant' as const,
              text: response.content,
              durationMs,
              createdAt: new Date().toISOString(),
            }
          : msg
      ));

      // Update session title if this is the first message
      // Обновляем название сессии из первого сообщения, если оно еще "Новый чат"
      if (currentSessionId && agent) {
        const session = AgentChatService.getSession(currentSessionId, agent);
        if (session && (session.title === 'Новый чат' || !session.title || session.title.trim() === '')) {
          const title = text.slice(0, 35).trim();
          if (title) {
            AgentChatService.updateSession(currentSessionId, agent, { title });
          }
        }
      }
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Replace loading message with error message
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMsgId 
          ? {
              id: loadingMsgId,
              role: 'assistant' as const,
              text: `Ошибка: ${error.message || 'Не удалось получить ответ от AI'}`,
              createdAt: new Date().toISOString(),
            }
          : msg
      ));
      
      showToast(error.message || 'Ошибка при отправке сообщения', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // preload initial message from navigation (e.g., Dashboard)
  if (initialMessage && !hasInitialized) {
    setTimeout(() => {
      handleSend(initialMessage);
      setHasInitialized(true);
    }, 0);
  }

  const tourSteps: AgentTourStep[] = onboarding ? [
    {
      target: '[data-tour="chat-input"]',
      title: "Начните с понятной задачи",
      description: onboarding.inputHint,
      actionLabel: message.trim() ? "Продолжить" : "Подставить пример",
      onAction: () => { if (!message.trim()) setMessage(onboarding.examples[0].prompt); setTourStep(1); },
    },
    {
      target: onboarding.sourceFile ? '[data-tour="chat-attach"]' : '[data-tour="chat-input"]',
      title: onboarding.sourceFile ? "Добавьте исходный материал" : "Уточните ожидаемый результат",
      description: onboarding.sourceFile
        ? `Выберите свой файл через эту кнопку. Для знакомства можно взять пример «${onboarding.sourceFile}».`
        : "Укажите контекст и формат: письмо, список шагов или таблица. Это поможет сделать ответ полезнее.",
      actionLabel: onboarding.sourceFile ? "Взять демо-файл" : "Добавить контекст",
      onAction: () => {
        if (onboarding.sourceFile) setAttachedFiles([{ name: onboarding.sourceFile }]);
        else setMessage(value => `${value}\nОформи результат кратко, выдели следующий шаг.`);
        setTourStep(2);
      },
    },
    {
      target: '[data-tour="chat-send"]',
      title: "Отправьте запрос агенту",
      description: "Запрос готов. Нажмите кнопку отправки в чате или кнопку ниже, чтобы посмотреть учебный результат.",
      actionLabel: isLoading ? "Подождите…" : "Отправить пример",
      onAction: () => { void handleSend(); },
    },
    {
      target: '[data-tour="agent-result"]',
      title: "Первый результат готов",
      description: onboarding.resultHint,
      actionLabel: "Завершить",
      onAction: closeTour,
    },
  ] : [];

  if (isTranslatorAgent) {
    const isV2 =
      navState.agentId === "Translator-2" || agent === "Переводчик 2.0";
    return (
      <div className="flex flex-col h-full min-h-0">
        <PageHeader
          title="AI-Studio"
          subtitle={isV2 ? "Переводчик 2.0 · документный режим" : "Платформа перевода документов"}
        />
        <main className="flex-1 min-h-0 p-4 md:p-6">
          {isV2 ? <TranslatorDocumentPlatform /> : <TranslatorPlatform />}
        </main>
      </div>
    );
  }

  return <div className="flex flex-col h-screen">
      <PageHeader
        title="AI-Studio"
        subtitle={
          isPresentationAgent
            ? "Создатель презентаций · мастер и экспорт в этом чате"
            : onboarding
              ? onboarding.name
              : undefined
        }
      />
      <main className="flex-1 flex min-h-0">
        {/* Agent History Sidebar - слева */}
        {agent && (
          <AgentHistorySidebar
            agentId={agent}
            activeSessionId={currentSessionId || undefined}
            onSessionSelect={handleSessionSelect}
            onNewSession={handleNewSession}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            position="left"
          />
        )}

        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          {onboarding && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 px-6 py-3">
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <MousePointer2 className="h-3.5 w-3.5 text-primary" />
                {onboardingComplete ? "Знакомство пройдено" : "Начните с короткого знакомства"}
              </span>
              <Button variant="ghost" size="sm" onClick={startTour} className="h-7 gap-1.5 text-xs"><CircleHelp className="h-3.5 w-3.5" />{onboardingComplete ? "Повторить знакомство" : "Как пользоваться"}</Button>
            </div>
          )}
        {/* Chat Area */}
          {/* Chat header with export */}
          {messages.length > 0 && !isPresentationAgent && (
            <div className="flex items-center justify-end px-6 py-2 border-b border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExportReport}
                className="text-xs gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <FileDown className="h-4 w-4" />
                Выгрузка отчёта
              </Button>
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-6 pb-0">
              <div className="w-full max-w-3xl mx-auto">
                {messages.length === 0 && !isPresentationAgent ? (
                  onboarding && tourStep === null ? (
                    <AgentOnboarding
                      config={onboarding}
                      onStart={startTour}
                      onExample={prompt => { setMessage(prompt); document.querySelector<HTMLTextAreaElement>('[data-tour="chat-input"]')?.focus(); }}
                      onPreview={showAgentDemo}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-20">
                      <h2 className="text-2xl font-semibold mb-2">{tourStep !== null ? "Попробуем первую задачу вместе" : agent ? `Чат с агентом: ${agent}` : 'Начать беседу'}</h2>
                      <p className="text-muted-foreground max-w-md">
                        {onboarding ? onboarding.inputHint : "Задавайте вопросы выбранному агенту из AI Studio"}
                      </p>
                    </div>
                  )
                ) : (
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
                          <div data-tour={msg.role === "assistant" && !msg.isLoading && index === messages.length - 1 ? "agent-result" : undefined} className={msg.role === 'user' ? 'flex justify-end' : ''}>
                            {onboarding && msg.role === "assistant" && !msg.isLoading && <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-primary"><Sparkles className="h-3 w-3" />Пример ответа · учебные данные</p>}
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
                                        feedbackReasons: reasons,
                                        feedbackDetails: details || "",
                                      } 
                                    : m
                                ));
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {isPresentationAgent && (
                      <PresentationAgentPanel
                        key={currentSessionId ?? "presentation-draft"}
                        inlineInChat
                        appendChatMessages={appendPresentationMessages}
                      />
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Input at bottom when messages exist - фиксировано */}
          <div className="sticky bottom-0 px-4 pb-4 pt-8 z-10 bg-background/95 backdrop-blur-sm border-t border-border/60 relative before:absolute before:inset-x-0 before:-top-8 before:h-8 before:bg-gradient-to-t before:from-background/95 before:to-transparent before:backdrop-blur-sm before:pointer-events-none">
            <div className="w-full max-w-3xl mx-auto space-y-2">
              {/* Отображение прикрепленных файлов */}
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
                value={message}
                placeholder={isTranscriber ? "Добавьте запись или напишите, какой результат нужен…" : onboarding ? "Опишите задачу или выберите пример выше…" : placeholder}
                examples={examplePrompts}
                onChange={setMessage}
                onSend={() => handleSend()}
                onAttachClick={() => openAttachmentPicker("file")}
                attachLabel={onboarding ? "Добавить файл" : undefined}
                attachmentOptions={
                  isTranscriber
                    ? [
                        { value: "file", label: "Загрузить файл", icon: "file" },
                        { value: "audio", label: "Загрузить аудио", icon: "audio" },
                        { value: "video", label: "Загрузить видео", icon: "video" },
                      ]
                    : undefined
                }
                onAttachmentOptionSelect={(value) => openAttachmentPicker(value as AttachmentKind)}
                onStop={handleStop}
                disabled={isLoading}
                isLoading={isLoading}
                canSendWithoutText={attachedFiles.length > 0}
              />
              <div className="pb-1">
                <Disclaimer />
              </div>
            </div>
          </div>
        </div>
      </main>

      <FileDropOverlay
        onFilesDropped={(files) => setAttachedFiles(prev => [...prev, ...files])}
        acceptedTypes={isTranscriber ? TRANSCRIBER_ALL_TYPES : onboarding?.formats}
        maxSizeMB={isTranscriber ? 500 : 50}
        enabled={!isLoading}
      />

      {/* Modal для прикрепления файлов */}
      <Modal
        isOpen={isAttachModalOpen}
        onClose={() => setIsAttachModalOpen(false)}
        title={
          isTranscriber
            ? attachmentKind === "audio"
              ? "Загрузить аудио"
              : attachmentKind === "video"
                ? "Загрузить видео"
                : "Добавить запись"
            : "Прикрепить файлы"
        }
        size="md"
      >
        <FileUpload
          key={isAttachModalOpen ? "open" : "closed"}
          onFilesSelected={(files) => {
            setAttachedFiles(prev => [...prev, ...files]);
            setIsAttachModalOpen(false);
            if (tourStep === 1) setTourStep(2);
          }}
          acceptedTypes={
            isTranscriber
              ? getTranscriberAcceptedTypes()
              : onboarding?.formats || [".pdf", ".docx", ".doc", ".txt", ".md", ".csv", ".xlsx", ".xls", ".png", ".jpg", ".jpeg"]
          }
          multiple={true}
          maxSizeMB={isTranscriber ? 500 : 50}
        />
      </Modal>
      {onboarding && <AgentGuidedTour name={onboarding.name} step={isAttachModalOpen ? null : tourStep} steps={tourSteps} onBack={() => setTourStep(step => step === null ? null : Math.max(0, step - 1))} onClose={closeTour} />}
    </div>;
}
