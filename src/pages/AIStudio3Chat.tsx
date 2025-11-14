import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, ChevronLeft, ChevronRight, X, File } from "lucide-react";
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

export default function AIStudio3Chat() {
  const {
    t
  } = useLanguage();
  const { showToast } = useToast();
  const location = useLocation();
  const agent = (location.state as any)?.agent as string | undefined;
  const placeholder = (location.state as any)?.placeholder as string | undefined;
  const initialMessage = (location.state as any)?.initialMessage as string | undefined;
  const [message, setMessage] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; text: string; files?: File[]; isLoading?: boolean }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const examplePrompts = ["Сформируй краткую сводку по рынку за Q3 2025", "Подготовь анализ конкурентов в сфере e-commerce", "Предложи 3 риск-фактора для проекта AI", "Составь план внедрения чата-бота в службу поддержки"];
  
  const loadSession = useCallback((sessionId: string) => {
    const savedMessages = AgentChatService.getMessages(sessionId);
    if (savedMessages.length > 0) {
      const convertedMessages = savedMessages.map(m => ({
        id: m.id,
        role: m.role,
        text: m.text,
        files: m.files?.map(f => {
          // Create a File-like object (we can't fully restore File objects from localStorage)
          const blob = new Blob([], { type: 'application/octet-stream' });
          const file = new File([blob], f.name);
          Object.defineProperty(file, 'size', { value: f.size });
          return file;
        }) || [],
        isLoading: false,
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
    const sessionIdFromState = (location.state as any)?.sessionId;
    if (sessionIdFromState) {
      loadSession(sessionIdFromState);
    }
  }, [agent, location.state, loadSession]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
          files: m.files?.map(f => ({ name: f.name, size: f.size })),
          createdAt: new Date().toISOString(),
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
  };

  const handleSessionSelect = (sessionId: string) => {
    loadSession(sessionId);
  };
  
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
    const userMsg = {
      id: Math.random().toString(36).slice(2),
      role: 'user' as const,
      text: text || `Прикреплено ${attachedFiles.length} файл(ов)`,
      files: [...attachedFiles]
    };
    
    const loadingMsgId = Math.random().toString(36).slice(2);
    const loadingMsg = {
      id: loadingMsgId,
      role: 'assistant' as const,
      text: '...',
      isLoading: true,
    };
    
    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setMessage("");
    setAttachedFiles([]);
    
    try {
      // Build system prompt based on agent
      const systemPrompt = agent 
        ? `Ты ${agent} - эксперт AI ассистент. Отвечай на русском языке профессионально и подробно.`
        : 'Ты полезный AI ассистент для платформы QC AI-HUB Enterprise Platform. Отвечай на русском языке профессионально и дружелюбно.';
      
      // Convert messages to format expected by AI service
      const chatMessages = [
        ...messages.filter(m => !m.isLoading).map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text + (m.files && m.files.length > 0 ? `\n\nПрикреплено файлов: ${m.files.map(f => f.name).join(', ')}` : ''),
        })),
        { role: 'user' as const, content: text || `Прикреплено ${attachedFiles.length} файл(ов)` },
      ];
      
      // Call AI service
      const response = await sendChatMessage(chatMessages, {
        model: import.meta.env.VITE_AI_MODEL || 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 1500,
        systemPrompt,
      });
      
      // Replace loading message with actual response
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMsgId 
          ? { id: loadingMsgId, role: 'assistant' as const, text: response.content }
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
          ? { id: loadingMsgId, role: 'assistant' as const, text: `Ошибка: ${error.message || 'Не удалось получить ответ от AI'}` }
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
  return <div className="flex flex-col h-screen">
      <PageHeader title="AI-Studio 3" subtitle="Вариант с сайдбаром справа" />
      <main className="flex-1 flex min-h-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 border-t">
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-3xl mx-auto">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <h2 className="text-2xl font-semibold mb-2">{agent ? `Чат с агентом: ${agent}` : 'Начать беседу'}</h2>
                  <p className="text-muted-foreground max-w-md">Задавайте вопросы выбранному агенту из AI Studio</p>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm border ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground border-primary/60'
                            : 'bg-card border-border'
                        }`}
                      >
                        {msg.isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-75" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150" />
                          </div>
                        ) : (
                          <>
                            <div className="break-words whitespace-pre-wrap">{msg.text}</div>
                            {msg.files && msg.files.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-primary/20 flex flex-wrap gap-2">
                                {msg.files.map((file, idx) => (
                                  <Badge key={idx} variant="default" className="text-xs">
                                    <File className="h-3 w-3 mr-1" />
                                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-background">
            <div className="max-w-3xl mx-auto space-y-2">
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
                placeholder={placeholder}
                examples={examplePrompts}
                onChange={setMessage}
                onSend={() => handleSend()}
                onAttachClick={() => setIsAttachModalOpen(true)}
                disabled={isLoading}
                className="mb-3"
              />
            </div>
          </div>
        </div>

        {/* Agent History Sidebar - справа, только если выбран агент */}
        {agent && (
          <AgentHistorySidebar
            agentId={agent}
            activeSessionId={currentSessionId || undefined}
            onSessionSelect={handleSessionSelect}
            onNewSession={handleNewSession}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            position="right"
          />
        )}
      </main>

      {/* Modal для прикрепления файлов */}
      <Modal
        isOpen={isAttachModalOpen}
        onClose={() => setIsAttachModalOpen(false)}
        title="Прикрепить файлы"
        size="md"
      >
        <FileUpload
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

