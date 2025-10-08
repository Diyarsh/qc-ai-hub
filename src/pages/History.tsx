import { Input } from "@/components/ui/input";
import { Search, MessageSquare, MoreHorizontal, ExternalLink, Edit2, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const historyItems = [
  { text: "fff", time: "17 hours ago", icon: "💬" },
  { text: "Как оформить отпуск в...", time: "1 week ago", icon: "📝" },
  { text: "Как оформить отпуск в...", time: "1 week ago", icon: "💼" },
  { text: "Как оформить отпуск в...", time: "1 week ago", icon: "🔍" },
  { text: "📊 Проанализируй финансовый отчет...", time: "1 week ago", icon: "📊" },
  { text: "Как оформить отпуск в...", time: "1 week ago", icon: "🎯" },
  { text: "Как оформить отпуск в...", time: "1 week ago", icon: "✨" },
  { text: "Как оформить отпуск в...", time: "1 week ago", icon: "🚀" },
  { text: "Как оформить отпуск в...", time: "1 week ago", icon: "💡" },
  { text: "Как оформить отпуск в...", time: "1 week ago", icon: "🎨" },
  { text: "Как оформить отпуск в...", time: "1 week ago", icon: "📱" },
  { text: "📊 Проанализируй финансовый отчет...", time: "1 week ago", icon: "📊" }
];

export default function History() {
  const { t } = useLanguage();
  
  const formatTime = (time: string) => {
    if (time.includes('hours ago')) return time.replace('hours ago', t('history.hours-ago'));
    if (time.includes('week ago')) return time.replace('week ago', t('history.weeks-ago'));
    if (time.includes('weeks ago')) return time.replace('weeks ago', t('history.weeks-ago'));
    if (time.includes('days ago')) return time.replace('days ago', t('history.days-ago'));
    return time;
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={t('history.title')} />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Search */}
          <div className="flex justify-end mb-6">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('history.search')}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    {t('history.name')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    {t('history.type')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    {t('history.updated')}
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {historyItems.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm flex items-center gap-1.5">
                          {item.icon && <span>{item.icon}</span>}
                          {item.text}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">
                        {t('history.chat-prompt')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">
                        {formatTime(item.time)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            {t('history.open-new-tab')}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit2 className="h-4 w-4 mr-2" />
                            {t('history.rename')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('history.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}