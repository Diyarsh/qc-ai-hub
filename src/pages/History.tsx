import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";

const historyItems = [
  { text: "Как оформить отпуск в...", time: "3 days ago" },
  { text: "Как оформить отпуск в...", time: "3 days ago" },
  { text: "Как оформить отпуск в...", time: "3 days ago" },
  { text: "📊 Проанализируй финансовый отчет...", time: "3 days ago" },
  { text: "Как оформить отпуск в...", time: "3 days ago" },
  { text: "Как оформить отпуск в...", time: "3 days ago" },
  { text: "Как оформить отпуск в...", time: "3 days ago" },
  { text: "Как оформить отпуск в...", time: "3 days ago" },
  { text: "Как оформить отпуск в...", time: "3 days ago" },
  { text: "Как оформить отпуск в...", time: "3 days ago" },
  { text: "Как оформить отпуск в...", time: "3 days ago" }
];

export default function History() {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col h-full">
      <PageHeader title={t('history.title')} />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('history.search')}
              className="pl-10 w-full max-w-2xl"
            />
          </div>

          <div className="space-y-3">
            {historyItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 px-4 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{item.text}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {item.time.includes('days') ? item.time.replace('days ago', t('history.days-ago')) : item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}