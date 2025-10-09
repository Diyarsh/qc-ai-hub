import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export default function AIStudioChat() {
  const location = useLocation();
  const agent = (location.state as any)?.agent as string | undefined;
  const placeholder = (location.state as any)?.placeholder as string | undefined;
  const [message, setMessage] = useState("");
  const [queries, setQueries] = useState<string[]>([]);

  const handleSend = () => {
    const text = message.trim();
    if (!text) return;
    setQueries(prev => [text, ...prev]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={agent ? `AI Studio · ${agent}` : 'AI Studio Chat'} />
      <main className="flex-1 flex min-w-0 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 border-r bg-card flex flex-col">
          <div className="mx-3 mt-3 mb-2 p-3 border rounded-md">
            <div className="text-xs text-muted-foreground mb-1">Агент</div>
            <div className="text-sm font-semibold truncate">{agent || '—'}</div>
          </div>
          <div className="p-3">
            <Button variant="default" className="w-full justify-center gap-2 mb-3">
              <Plus className="h-4 w-4" />
              Новый чат
            </Button>
            <ScrollArea className="h-[calc(100vh-260px)] pr-1">
              <div className="space-y-2">
                {queries.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-4">История запросов пуста</div>
                )}
                {queries.map((q, idx) => (
                  <div key={idx} className="text-xs p-2 border rounded-md bg-card/50 hover:bg-accent cursor-default line-clamp-2" title={q}>
                    {q}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
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
          <div className="border-t p-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2">
                <Input
                  placeholder={placeholder || "Сформулируйте запрос агенту"}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  className="flex-1"
                />
                <Button size="icon" className="flex-shrink-0" onClick={handleSend}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


