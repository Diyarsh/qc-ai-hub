import { Input } from "@/components/ui/input";
import { Search, MoreVertical, ExternalLink, Edit2, Trash2, ChevronDown, ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
// Маппинг агентов на модели LLM
const agentToModelMap: Record<string, string> = {
  "LLM-Ultra": "Qwen2.5 72B",
  "Assistant Pro": "GPT-4 Turbo",
  "Doc AI": "GPT-4 Turbo",
  "Translation Master": "DeepSeek Chat",
  "Code Assistant": "DeepSeek Coder",
  "Data Analyst": "GPT-4 Turbo",
  "Legal Advisor": "GPT-4 Turbo",
  "Content Creator": "GPT-3.5 Turbo",
  "Financial Advisor": "GPT-4 Turbo",
  "Customer Support": "GPT-3.5 Turbo",
  "Research Assistant": "GPT-4 Turbo",
  "Security Auditor": "GPT-4 Turbo",
};

const staticHistory = [{
  text: "Проанализировать GDPR требования для корпоративного сектора",
  time: "2 часа назад",
  type: "chat",
  model: "LLM-Ultra"
}, {
  text: "Создать шаблон онбординга для новых сотрудников",
  time: "5 часов назад",
  type: "chat",
  model: "Assistant Pro"
}, {
  text: "Извлечь ключевые требования из договора поставки",
  time: "1 день назад",
  type: "chat",
  model: "Doc AI"
}, {
  text: "Перевести техническую документацию на казахский",
  time: "1 день назад",
  type: "chat",
  model: "Translation Master"
}, {
  text: "Написать функцию валидации ИИН на TypeScript",
  time: "2 дня назад",
  type: "chat",
  model: "Code Assistant"
}, {
  text: "Проанализировать продажи за Q3 2025 и выявить тренды",
  time: "3 дня назад",
  type: "chat",
  model: "Data Analyst"
}, {
  text: "Проанализировать договор на соответствие законодательству РК",
  time: "4 дня назад",
  type: "chat",
  model: "Legal Advisor"
}, {
  text: "Написать пост для LinkedIn о новых возможностях AI",
  time: "5 дней назад",
  type: "chat",
  model: "Content Creator"
}, {
  text: "Проанализировать финансовую отчетность компании за год",
  time: "1 неделю назад",
  type: "chat",
  model: "Financial Advisor"
}, {
  text: "Клиент спрашивает о возврате товара, как помочь?",
  time: "1 неделю назад",
  type: "chat",
  model: "Customer Support"
}, {
  text: "Подготовить обзор современных методов машинного обучения",
  time: "2 недели назад",
  type: "chat",
  model: "Research Assistant"
}, {
  text: "Проверить код на уязвимости безопасности",
  time: "2 недели назад",
  type: "chat",
  model: "Security Auditor"
}];
export default function History() {
  const {
    t
  } = useLanguage();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const formatTime = (time: string) => {
    // If already in Russian, return as is
    if (time.includes('назад')) return time;
    // English to Russian conversion
    if (time.includes('hours ago')) return time.replace('hours ago', t('history.hours-ago'));
    if (time.includes('week ago')) return time.replace('week ago', t('history.week-ago'));
    if (time.includes('weeks ago')) return time.replace('weeks ago', t('history.weeks-ago'));
    if (time.includes('days ago')) return time.replace('days ago', t('history.days-ago'));
    return time;
  };
  const getTypeLabel = (type: string) => {
    return type === 'veo' ? t('history.veo-prompt') : t('history.chat-prompt');
  };
  
  // Получить название модели по агенту
  const getModelName = (agentName: string): string => {
    return agentToModelMap[agentName] || agentName;
  };
  
  const parseTime = (time: string) => {
    // Russian time parsing
    const hoursMatch = time.match(/(\d+)\s*час(?:а|ов)?\s*назад/);
    if (hoursMatch) return parseInt(hoursMatch[1]);
    const daysMatch = time.match(/(\d+)\s*дн(?:я|ей|ень)?\s*назад/);
    if (daysMatch) return parseInt(daysMatch[1]) * 24;
    const weeksMatch = time.match(/(\d+)\s*недел(?:и|ь|ю|ей)?\s*назад/);
    if (weeksMatch) return parseInt(weeksMatch[1]) * 7 * 24;
    // English fallback
    const hoursMatchEn = time.match(/(\d+)\s*hours?\s*ago/);
    if (hoursMatchEn) return parseInt(hoursMatchEn[1]);
    const weeksMatchEn = time.match(/(\d+)\s*weeks?\s*ago/);
    if (weeksMatchEn) return parseInt(weeksMatchEn[1]) * 7 * 24;
    const daysMatchEn = time.match(/(\d+)\s*days?\s*ago/);
    if (daysMatchEn) return parseInt(daysMatchEn[1]) * 24;
    return 0;
  };
  
  const [dynamicHistory, setDynamicHistory] = useState<Array<{ text: string; time: string; type: string; model: string }>>([]);
  useEffect(() => {
    const loadHistory = () => {
    try {
      const ls = JSON.parse(localStorage.getItem('dashboard.history') || '[]');
      setDynamicHistory(ls);
    } catch {}
    };

    loadHistory();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dashboard.history') {
        loadHistory();
      }
    };

    const handleCustomStorage = () => {
      loadHistory();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dashboard.history.updated', handleCustomStorage);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dashboard.history.updated', handleCustomStorage);
    };
  }, []);

  const merged = useMemo(() => [...dynamicHistory.map(i => ({...i, time: '2 часа назад'})), ...staticHistory], [dynamicHistory]);
  const sortedItems = [...merged].sort((a, b) => {
    const timeA = parseTime(a.time);
    const timeB = parseTime(b.time);
    // Default: desc (newest first)
    return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
  });
  
  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  return <div className="flex flex-col h-full">
      <PageHeader title={t('history.title')} />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t('history.search')} className="pl-10" />
            </div>
            
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border">
            <div className="overflow-x-auto overflow-y-auto h-[calc(100vh-200px)] w-full">
              <table className="w-full border-collapse table-fixed" style={{ width: '100%' }}>
                <colgroup>
                  <col style={{ width: '40%', maxWidth: '400px' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '60px' }} />
                </colgroup>
                <thead className="bg-background sticky top-0 z-10 shadow-sm">
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground bg-background" style={{ maxWidth: '400px' }}>
                      {t('history.name')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground bg-background">
                      {t('history.model')}
                    </th>
                    <th 
                      className="text-right py-3 px-4 text-sm font-medium text-muted-foreground bg-background cursor-pointer hover:text-foreground transition-colors whitespace-nowrap"
                      onClick={toggleSort}
                      style={{ width: '20%' }}
                    >
                      <div className="flex items-center justify-end gap-2">
                        {t('history.updated')}
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground bg-background" style={{ width: '60px' }}>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((item, index) => <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4" style={{ maxWidth: '400px', overflow: 'hidden' }}>
                        <span className="text-sm truncate block">
                          {item.text}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground truncate block">
                          {getModelName(item.model)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap" style={{ width: '20%' }}>
                        <span className="text-sm text-muted-foreground">
                          {formatTime(item.time)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center" style={{ width: '60px' }}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
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
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>;
}
