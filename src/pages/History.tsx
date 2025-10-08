import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, ExternalLink, Edit2, Trash2, ChevronDown, ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
const historyItems = [{
  text: "Analyze quantum computing algorithms",
  time: "17 hours ago",
  type: "chat",
  model: "GPT-4"
}, {
  text: "Create AI-powered data visualization",
  time: "1 week ago",
  type: "chat",
  model: "Claude 3"
}, {
  text: "Generate video from text description",
  time: "1 week ago",
  type: "veo",
  model: "Veo 2"
}, {
  text: "Optimize database query performance",
  time: "1 week ago",
  type: "chat",
  model: "GPT-4"
}, {
  text: "Build machine learning model pipeline",
  time: "1 week ago",
  type: "chat",
  model: "Gemini Pro"
}, {
  text: "Generate product demo video",
  time: "1 week ago",
  type: "veo",
  model: "Veo 2"
}, {
  text: "Implement natural language processing",
  time: "1 week ago",
  type: "chat",
  model: "Claude 3"
}, {
  text: "Create animated explainer video",
  time: "1 week ago",
  type: "veo",
  model: "Veo 2"
}, {
  text: "Develop recommendation system",
  time: "1 week ago",
  type: "chat",
  model: "GPT-4"
}, {
  text: "Generate marketing campaign video",
  time: "1 week ago",
  type: "veo",
  model: "Veo 2"
}, {
  text: "Design distributed system architecture",
  time: "2 weeks ago",
  type: "chat",
  model: "Gemini Pro"
}, {
  text: "Implement real-time data streaming",
  time: "2 weeks ago",
  type: "chat",
  model: "Claude 3"
}];
export default function History() {
  const {
    t
  } = useLanguage();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const formatTime = (time: string) => {
    if (time.includes('hours ago')) return time.replace('hours ago', t('history.hours-ago'));
    if (time.includes('week ago')) return time.replace('week ago', t('history.week-ago'));
    if (time.includes('weeks ago')) return time.replace('weeks ago', t('history.weeks-ago'));
    if (time.includes('days ago')) return time.replace('days ago', t('history.days-ago'));
    return time;
  };
  const getTypeLabel = (type: string) => {
    return type === 'veo' ? t('history.veo-prompt') : t('history.chat-prompt');
  };
  
  const parseTime = (time: string) => {
    const hoursMatch = time.match(/(\d+)\s*hours?\s*ago/);
    if (hoursMatch) return parseInt(hoursMatch[1]);
    const weeksMatch = time.match(/(\d+)\s*weeks?\s*ago/);
    if (weeksMatch) return parseInt(weeksMatch[1]) * 7 * 24;
    const daysMatch = time.match(/(\d+)\s*days?\s*ago/);
    if (daysMatch) return parseInt(daysMatch[1]) * 24;
    return 0;
  };
  
  const sortedItems = [...historyItems].sort((a, b) => {
    const timeA = parseTime(a.time);
    const timeB = parseTime(b.time);
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
          <div className="rounded-lg overflow-hidden border-y">
            <div className="overflow-auto h-[calc(100vh-200px)]">
              <table className="w-full relative">
                <thead className="bg-background sticky top-0 z-10 shadow-sm">
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground bg-background">
                      {t('history.name')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground bg-background">
                      {t('history.model')}
                    </th>
                    <th 
                      className="text-left py-3 px-4 text-sm font-medium text-muted-foreground bg-background cursor-pointer hover:text-foreground transition-colors"
                      onClick={toggleSort}
                    >
                      <div className="flex items-center gap-2">
                        {t('history.updated')}
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="w-12 bg-background"></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((item, index) => <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <span className="text-sm">
                          {item.text}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">
                          {item.model}
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
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>;
}