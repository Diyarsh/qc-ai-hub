import { useState } from "react";
import { Bell, Sparkles, Zap, Shield, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  { icon: LucideIcon; label: string; bg: string; text: string }
> = {
  feature: { icon: Sparkles, label: "Новое", bg: "bg-emerald-500/15", text: "text-emerald-500" },
  improvement: { icon: Zap, label: "Улучшение", bg: "bg-amber-500/15", text: "text-amber-500" },
  fix: { icon: Wrench, label: "Исправление", bg: "bg-sky-500/15", text: "text-sky-500" },
  security: { icon: Shield, label: "Безопасность", bg: "bg-rose-500/15", text: "text-rose-500" },
};

const updates: UpdateItem[] = [
  { id: "1", title: "Суммаризатор v2.0", description: "Точность суммаризации +40%, поддержка таблиц и графиков", date: "3 мар", type: "feature", isNew: true },
  { id: "2", title: "Быстрее в 2 раза", description: "Ускорена обработка PDF и DOCX документов", date: "28 фев", type: "improvement", isNew: true },
  { id: "3", title: "+5 языков перевода", description: "Улучшено качество казахского перевода", date: "25 фев", type: "feature" },
  { id: "4", title: "Загрузка файлов >25МБ", description: "Устранена проблема с крупными файлами", date: "22 фев", type: "fix" },
  { id: "5", title: "Шифрование данных", description: "Сквозное шифрование файловых операций", date: "20 фев", type: "security" },
];

export function NotificationsPopover() {
  const newCount = updates.filter((u) => u.isNew).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {newCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1 leading-none">
              {newCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="px-4 py-3 border-b border-border">
          <h4 className="text-sm font-semibold text-foreground">Обновления платформы</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{newCount} новых</p>
        </div>
        <div className="max-h-[360px] overflow-y-auto">
          {updates.map((update) => {
            const config = typeConfig[update.type];
            const Icon = config.icon;
            return (
              <div
                key={update.id}
                className={cn(
                  "flex gap-3 px-4 py-3 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer",
                  update.isNew && "bg-primary/5"
                )}
              >
                <div className={cn("mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0", config.bg)}>
                  <Icon className={cn("h-4 w-4", config.text)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">{update.title}</span>
                    {update.isNew && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/15 px-1.5 py-0.5 rounded-full shrink-0">
                        new
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{update.description}</p>
                  <span className="text-[10px] text-muted-foreground/60 mt-1 block">{update.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
