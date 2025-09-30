import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Clock, MessageCircle, Settings, Sun, Moon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTheme } from "next-themes";

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
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">{t('history.title')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">{t('history.title')}</h2>
          </div>

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