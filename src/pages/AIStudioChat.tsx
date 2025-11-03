import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Plus, ChevronLeft, ChevronRight, X, File } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChatComposer } from "@/components/ChatComposer";
import { Modal } from "@/shared/components/Modal";
import { FileUpload } from "@/shared/components/Forms/FileUpload";
import { Badge } from "@/shared/components/Badge";
import { sendChatMessage } from "@/shared/services/ai.service";
import { useToast } from "@/shared/components/Toast";
export default function AIStudioChat() {
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
  
  const examplePrompts = ["Сформируй краткую сводку по рынку за Q3 2025", "Подготовь анализ конкурентов в сфере e-commerce", "Предложи 3 риск-фактора для проекта AI", "Составь план внедрения чата-бота в службу поддержки"];
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = async (textOverride?: string) => {
    const text = (textOverride ?? message).trim();
    if ((!text && attachedFiles.length === 0) || isLoading) return;
    
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
      <PageHeader title={t('ai-studio.title')} subtitle={t('ai-studio.subtitle')} />
      <main className="flex-1 flex min-h-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 border-t">
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-3xl mx-auto">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
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
                            <div>{msg.text}</div>
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