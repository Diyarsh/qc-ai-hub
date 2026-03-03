import { useState, useRef } from "react";
import { Sparkles, Zap, Shield, Wrench, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
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

const typeConfig: Record<
  UpdateItem["type"],
  { icon: LucideIcon; label: string; gradient: string; glow: string; border: string }
> = {
  feature: {
    icon: Sparkles,
    label: "Новое",
    gradient: "from-emerald-500/20 via-emerald-400/5 to-transparent",
    glow: "shadow-emerald-500/20",
    border: "border-emerald-500/25",
  },
  improvement: {
    icon: Zap,
    label: "Улучшение",
    gradient: "from-amber-500/20 via-amber-400/5 to-transparent",
    glow: "shadow-amber-500/20",
    border: "border-amber-500/25",
  },
  fix: {
    icon: Wrench,
    label: "Исправление",
    gradient: "from-sky-500/20 via-sky-400/5 to-transparent",
    glow: "shadow-sky-500/20",
    border: "border-sky-500/25",
  },
  security: {
    icon: Shield,
    label: "Безопасность",
    gradient: "from-rose-500/20 via-rose-400/5 to-transparent",
    glow: "shadow-rose-500/20",
    border: "border-rose-500/25",
  },
};

const updates: UpdateItem[] = [
  {
    id: "1",
    title: "Суммаризатор v2.0",
    description: "Точность суммаризации +40%, поддержка таблиц и графиков",
    date: "3 мар",
    type: "feature",
    isNew: true,
  },
  {
    id: "2",
    title: "Быстрее в 2 раза",
    description: "Ускорена обработка PDF и DOCX документов",
    date: "28 фев",
    type: "improvement",
    isNew: true,
  },
  {
    id: "3",
    title: "+5 языков перевода",
    description: "Улучшено качество казахского перевода",
    date: "25 фев",
    type: "feature",
  },
  {
    id: "4",
    title: "Загрузка файлов >25МБ",
    description: "Устранена проблема с крупными файлами",
    date: "22 фев",
    type: "fix",
  },
  {
    id: "5",
    title: "Шифрование данных",
    description: "Сквозное шифрование файловых операций",
    date: "20 фев",
    type: "security",
  },
];

export function PlatformUpdatesBanner() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <div className="w-full mb-6">
      {/* Section label */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Обновления
          </span>
          <span className="text-[10px] font-bold text-primary-foreground bg-primary px-1.5 py-0.5 rounded-full leading-none">
            {updates.filter((u) => u.isNew).length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={cn(
              "p-1 rounded-lg transition-all",
              canScrollLeft
                ? "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                : "text-muted-foreground/20 cursor-default"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={cn(
              "p-1 rounded-lg transition-all",
              canScrollRight
                ? "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                : "text-muted-foreground/20 cursor-default"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scrollable cards strip */}
      <div className="relative">
        {/* Fade edges */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto scrollbar-none pb-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {updates.map((update) => {
            const config = typeConfig[update.type];
            const Icon = config.icon;
            return (
              <div
                key={update.id}
                className={cn(
                  "group relative flex-shrink-0 w-[200px] rounded-2xl border overflow-hidden cursor-pointer",
                  "bg-card/60 backdrop-blur-sm transition-all duration-300",
                  "hover:scale-[1.03] hover:-translate-y-0.5",
                  config.border,
                  `hover:shadow-lg hover:${config.glow}`
                )}
              >
                {/* Background gradient */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-60 group-hover:opacity-100 transition-opacity duration-300",
                    config.gradient
                  )}
                />

                {/* Top accent */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-40 group-hover:opacity-80 transition-opacity" />

                <div className="relative z-10 p-3.5 flex flex-col h-full min-h-[110px]">
                  {/* Icon + badge row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-primary/10 blur-md scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <Icon
                        className="h-5 w-5 text-primary relative z-10"
                        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {update.isNew && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/15 px-1.5 py-0.5 rounded-full">
                          new
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground/50">{update.date}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-xs font-semibold text-foreground mb-1 leading-tight group-hover:text-primary transition-colors">
                    {update.title}
                  </h4>

                  {/* Description */}
                  <p className="text-[11px] text-muted-foreground/70 leading-snug line-clamp-2 flex-1">
                    {update.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
