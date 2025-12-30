import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, ChevronLeft, ChevronRight, MessageSquare, Trash2 } from "lucide-react";
import { AgentChatSession } from "@/types/agent-chat";
import { AgentChatService } from "@/services/agent-chat.service";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface AgentHistorySidebarProps {
  agentId: string;
  activeSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  position?: 'left' | 'right'; // default: 'right'
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffHours < 1) {
    return 'Только что';
  } else if (diffHours < 24) {
    const hours = Math.floor(diffHours);
    return `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'} назад`;
  } else if (diffDays < 2) {
    return 'Вчера';
  } else if (diffDays < 7) {
    const days = Math.floor(diffDays);
    return `${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'} назад`;
  } else {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  }
}

function SidebarContent({
  agentId,
  activeSessionId,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
}: {
  agentId: string;
  activeSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
}) {
  const [sessions, setSessions] = useState<AgentChatSession[]>([]);

  useEffect(() => {
    const loadSessions = () => {
      const loaded = AgentChatService.getSessions(agentId);
      if (loaded.length === 0) {
        // Generate mock data if empty
        const mock = AgentChatService.generateMockSessions(agentId);
        setSessions(mock);
      } else {
        setSessions(loaded);
      }
    };

    loadSessions();

    // Listen for storage changes (from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AgentChatService.getSessionsKey(agentId)) {
        loadSessions();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [agentId]);

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (window.confirm('Удалить этот чат?')) {
      AgentChatService.deleteSession(sessionId, agentId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      onDeleteSession(sessionId);
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ width: '100%', minWidth: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div className="px-3 py-3 border-b border-border" style={{ minWidth: 0, overflow: 'hidden' }}>
        <h3 className="text-[11px] font-medium text-muted-foreground mb-2">История с агентом</h3>
        <Button
          onClick={onNewSession}
          size="sm"
          variant="outline"
          className="w-full justify-start text-[11px] h-8"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Новый чат
        </Button>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        <div className="px-2 py-2 space-y-1">
          {sessions.filter(s => s.title !== 'Новый чат' && s.title.trim() !== '').length === 0 ? (
            <div className="px-3 py-8 text-center text-xs text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Нет сохраненных чатов</p>
            </div>
          ) : (
            sessions
              .filter(s => s.title !== 'Новый чат' && s.title.trim() !== '')
              .map((session) => (
              <button
                key={session.id}
                onClick={() => onSessionSelect(session.id)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-md transition-colors group",
                  "hover:bg-muted/50",
                  activeSessionId === session.id
                    ? "bg-muted border border-border"
                    : "bg-transparent"
                )}
                style={{ 
                  minWidth: 0, 
                  maxWidth: '100%', 
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                  width: '100%'
                }}
              >
                <div className="flex items-start gap-2 min-w-0 w-full">
                  <div className="flex-1 min-w-0 overflow-hidden pr-1" style={{ maxWidth: 'calc(100% - 28px)' }}>
                    <div 
                      className="text-[11px] font-medium text-foreground" 
                      title={session.title}
                      style={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block',
                        width: '100%',
                        maxWidth: '100%'
                      }}
                    >
                      {session.title}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, session.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                    title="Удалить"
                    style={{ flexShrink: 0, width: '20px', height: '20px', minWidth: '20px' }}
                  >
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export function AgentHistorySidebar({
  agentId,
  activeSessionId,
  onSessionSelect,
  onNewSession,
  collapsed = false,
  onToggleCollapse,
  position = 'right',
}: AgentHistorySidebarProps) {
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLeft = position === 'left';

  // Desktop version
  if (!isMobile) {
    return (
      <div
        className={cn(
          "flex-shrink-0 border-border bg-muted/30 transition-all duration-200",
          isLeft ? "border-r" : "border-l",
          collapsed ? "w-12" : "w-60"
        )}
        style={{ minWidth: collapsed ? '48px' : '240px', maxWidth: collapsed ? '48px' : '240px' }}
      >
        {collapsed ? (
          <div className="flex flex-col items-center py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="h-8 w-8"
            >
              {isLeft ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <div className="flex-1" />
              {onToggleCollapse && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleCollapse}
                  className="h-7 w-7"
                >
                  {isLeft ? (
                    <ChevronLeft className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
            <SidebarContent
              agentId={agentId}
              activeSessionId={activeSessionId}
              onSessionSelect={onSessionSelect}
              onNewSession={onNewSession}
              onDeleteSession={() => {}}
            />
          </>
        )}
      </div>
    );
  }

  // Mobile version - Sheet overlay
  return (
    <>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full shadow-lg"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px] p-0">
          <SidebarContent
            agentId={agentId}
            activeSessionId={activeSessionId}
            onSessionSelect={(id) => {
              onSessionSelect(id);
              setMobileOpen(false);
            }}
            onNewSession={() => {
              onNewSession();
              setMobileOpen(false);
            }}
            onDeleteSession={() => {}}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}

