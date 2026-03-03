import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, Zap, Shield, Wrench, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface UpdateItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "feature" | "improvement" | "fix" | "security";
  isNew?: boolean;
}

const typeConfig: Record<UpdateItem["type"], { icon: LucideIcon; label: string; color: string; bgColor: string }> = {
  feature: { icon: Sparkles, label: "Новое", color: "text-emerald-400", bgColor: "bg-emerald-500/15 border-emerald-500/20" },
  improvement: { icon: Zap, label: "Улучшение", color: "text-amber-400", bgColor: "bg-amber-500/15 border-amber-500/20" },
  fix: { icon: Wrench, label: "Исправление", color: "text-sky-400", bgColor: "bg-sky-500/15 border-sky-500/20" },
  security: { icon: Shield, label: "Безопасность", color: "text-rose-400", bgColor: "bg-rose-500/15 border-rose-500/20" },
};

const updates: UpdateItem[] = [
  {
    id: "1",
    title: "AI-агент «Суммаризатор» v2.0",
    description: "Улучшена точность суммаризации на 40%, добавлена поддержка таблиц и графиков",
    date: "3 марта 2026",
    type: "feature",
    isNew: true,
  },
  {
    id: "2",
    title: "Ускорение обработки документов",
    description: "Время обработки PDF и DOCX файлов сокращено в 2 раза",
    date: "28 февраля 2026",
    type: "improvement",
    isNew: true,
  },
  {
    id: "3",
    title: "Обновление моделей перевода",
    description: "Добавлена поддержка 5 новых языков, улучшено качество казахского перевода",
    date: "25 февраля 2026",
    type: "feature",
  },
  {
    id: "4",
    title: "Исправлена ошибка загрузки файлов",
    description: "Устранена проблема с загрузкой файлов более 25 МБ",
    date: "22 февраля 2026",
    type: "fix",
  },
  {
    id: "5",
    title: "Усилена защита данных",
    description: "Внедрено сквозное шифрование для всех файловых операций",
    date: "20 февраля 2026",
    type: "security",
  },
];

export function PlatformUpdatesBanner() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return localStorage.getItem("updates-banner-dismissed") === "true";
    } catch {
      return false;
    }
  });

  if (isDismissed) return null;

  const newCount = updates.filter((u) => u.isNew).length;
  const visibleUpdates = isExpanded ? updates : updates.slice(0, 2);

  return (
    <div className="w-full max-w-3xl mx-auto mb-4">
      <div
        className={cn(
          "relative rounded-2xl border border-border/40 overflow-hidden transition-all duration-300",
          "bg-card/50 backdrop-blur-md",
          "shadow-lg shadow-primary/5"
        )}
      >
        {/* Decorative gradient strip */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/60 via-primary/60 to-amber-500/60" />

        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">Обновления платформы</span>
            {newCount > 0 && (
              <Badge variant="default" className="bg-primary/20 text-primary border-primary/30 text-[10px] px-1.5 py-0">
                {newCount} новых
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDismissed(true);
                try {
                  localStorage.setItem("updates-banner-dismissed", "true");
                } catch {}
              }}
              className="p-1 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Update items */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="px-4 pb-3 space-y-2">
            {visibleUpdates.map((update) => {
              const config = typeConfig[update.type];
              const Icon = config.icon;
              return (
                <div
                  key={update.id}
                  className={cn(
                    "flex items-start gap-3 p-2.5 rounded-xl border transition-colors",
                    "hover:bg-accent/20",
                    config.bgColor
                  )}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground truncate">{update.title}</span>
                      {update.isNew && (
                        <span className="flex-shrink-0 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                          new
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{update.description}</p>
                  </div>
                  <span className="flex-shrink-0 text-[10px] text-muted-foreground/60 mt-0.5">{update.date}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
