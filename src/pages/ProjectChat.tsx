import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, ExternalLink, Pencil, Trash2, FolderOpen, Bot, Menu, Paperclip } from "lucide-react";
import { ProjectSettingsDialog } from "@/components/ProjectSettingsDialog";
import { ChatComposer } from "@/components/ChatComposer";
import { PageHeader } from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return `меньше часа назад`;
  if (diffHours < 24) return `${diffHours} часов назад`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} дней назад`;
  const diffWeeks = Math.floor(diffDays / 7);
  return `${diffWeeks} недель назад`;
}

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string; // ISO
};

type Conversation = {
  id: string;
  title: string;
  updatedAt: string; // ISO
  messages: Message[];
};

const LS_KEY = "projectChat.conversations";

export default function ProjectChat() {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("files");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // load/save to localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Conversation[];
        setConversations(parsed);
        if (parsed.length > 0) setSelectedId(parsed[0].id);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(conversations));
    } catch {}
  }, [conversations]);

  const createConversation = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    const title = trimmed.slice(0, 60);
    const nowIso = new Date().toISOString();
    const firstUser: Message = { id: id + "u", role: "user", content: trimmed, createdAt: nowIso };
    const firstAssistant: Message = { id: id + "a", role: "assistant", content: "Принято. Чем ещё могу помочь по проекту?", createdAt: nowIso };
    const conv: Conversation = { id, title, updatedAt: nowIso, messages: [firstUser, firstAssistant] };
    setConversations(prev => [conv, ...prev]);
    setSelectedId(id);
    setActiveTab("conversations");
  };

  const appendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    // if no conversation selected, create one
    if (!selectedId) {
      createConversation(trimmed);
      return;
    }
    setConversations(prev => prev.map(c => {
      if (c.id !== selectedId) return c;
      const nowIso = new Date().toISOString();
      const userMsg: Message = { id: Math.random().toString(36).slice(2), role: "user", content: trimmed, createdAt: nowIso };
      const assistantMsg: Message = { id: Math.random().toString(36).slice(2), role: "assistant", content: "OK — зафиксировал. Продолжайте.", createdAt: nowIso };
      return { ...c, messages: [...c.messages, userMsg, assistantMsg], updatedAt: nowIso, title: c.title || trimmed.slice(0, 60) };
    }));
  };

  const renameConversation = (id: string) => {
    const current = conversations.find(c => c.id === id);
    const nextTitle = window.prompt("Переименовать чат", current?.title || "");
    if (nextTitle && nextTitle.trim()) {
      setConversations(prev => prev.map(c => c.id === id ? { ...c, title: nextTitle.trim(), updatedAt: new Date().toISOString() } : c));
    }
  };

  const deleteConversation = (id: string) => {
    if (!window.confirm("Удалить чат?")) return;
    setConversations(prev => prev.filter(c => c.id !== id));
    setSelectedId(prev => (prev === id ? null : prev));
  };

  const selected = conversations.find(c => c.id === selectedId) || null;

  return <div className="flex flex-col h-screen">
      <PageHeader title={t('sidebar.projects')} subtitle="Управление проектными чатами" />
      <main className="flex-1 flex min-h-0">
      {/* Project Sidebar */}
      <div className="w-72 border-r bg-card flex flex-col">
        <button 
          onClick={() => setSettingsOpen(true)}
          className="mx-4 mt-3 mb-2 p-3 border rounded-md text-left hover:bg-accent/40 hover:border-primary/40 transition-all duration-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-medium text-sm">Инструкции</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-snug">
            Настройте инструкции для AI-HUB в этом проекте
          </p>
        </button>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 mx-4 mt-4 mb-2">
            <TabsTrigger value="files" className="text-xs">Файлы</TabsTrigger>
            <TabsTrigger value="conversations" className="text-xs">Чаты</TabsTrigger>
          </TabsList>

          {activeTab === "files" && <div className="flex-1 p-4">
              <Button variant="outline" className="w-full justify-center gap-2 mb-4">
                <Paperclip className="h-4 w-4" />
                Прикрепить
              </Button>
              
              <div className="flex flex-col items-center justify-center py-6 text-center border border-border rounded-lg">
                <FolderOpen className="h-10 w-10 text-muted-foreground mb-3 opacity-50" />
                <h3 className="font-medium mb-2 text-sm">Файлов пока нет</h3>
                <p className="text-xs text-muted-foreground max-w-[200px]">
                  Начните с прикрепления файлов к вашему проекту. Они будут использоваться во всех чатах этого проекта.
                </p>
              </div>
            </div>}

          {activeTab === "conversations" && <ScrollArea className="flex-1 p-4">
              {conversations.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">Нет активных бесед</div>
              ) : (
                <div className="space-y-2">
                  {conversations.map(conv => (
                    <div key={conv.id} className={`group flex items-center justify-between px-3 py-2 rounded-xl border transition ${selectedId === conv.id ? "bg-accent/50 border-primary/40" : "bg-background border-border hover:bg-accent/40"}`} onClick={() => { setSelectedId(conv.id); setActiveTab("conversations"); }}>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm truncate">{conv.title || "Без названия"}</div>
                        <div className="text-[11px] text-muted-foreground">{formatRelativeTime(new Date(conv.updatedAt))}</div>
                      </div>
                      <div className="ml-3 hidden group-hover:flex items-center gap-1">
                        <button title="Открыть" className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted" onClick={(e) => { e.stopPropagation(); setSelectedId(conv.id); }}>
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button title="Переименовать" className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted" onClick={(e) => { e.stopPropagation(); renameConversation(conv.id); }}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button title="Удалить" className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted" onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>}
        </Tabs>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {selected ? (
              <div className="space-y-4">
                {selected.messages.map(m => (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm border ${m.role === "user" ? "bg-primary text-primary-foreground border-primary/60" : "bg-card border-border"}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Начать беседу</h2>
                <p className="text-muted-foreground max-w-md">Задавайте вопросы, получайте помощь или обсуждайте ваш проект</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="p-4">
          <div className="max-w-3xl mx-auto">
            <ChatComposer
              value={message}
              onChange={setMessage}
              onSend={(text) => { selected ? appendMessage(text) : createConversation(text); setMessage(""); }}
              examples={[
                "Задайте вопрос по файлам проекта",
                "Попросите сгенерировать сводку по документам",
                "Уточните статус задач и рисков"
              ]}
              className="mb-3"
            />
          </div>
        </div>
      </div>

      <ProjectSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </main>
    </div>;
}