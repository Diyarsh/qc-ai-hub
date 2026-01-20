import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter,
  Sparkles,
  Briefcase,
  FileText,
  Code,
  Languages,
  BarChart3,
  Scale,
  PenTool,
  DollarSign,
  Headphones,
  GraduationCap,
  Shield,
  Kanban,
  Grid3x3,
  Factory,
  Users,
  Info
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

type AgentCategory = "all" | "language" | "assistant" | "documents" | "code" | "industrial";
type AgentType = "agent" | "developer";

interface Agent {
  id: string;
  name: string;
  description: string;
  category: AgentCategory[];
  type: AgentType;
  instructions: string;
  placeholder: string;
  tags: string[];
  isLocal: boolean;
  icon: LucideIcon;
  featured?: boolean;
  gradient?: string;
}

const agents: Agent[] = [
  {
    id: "LLM-Ultra",
    name: "LLM-Ultra",
    description: "Суверенная модель для корпоративного сектора",
    category: ["language"],
    type: "agent",
    instructions: "Высокоточная многоязычная модель для корпоративных задач. Отвечай кратко, ссылайся на источники, используй деловой стиль.",
    placeholder: "Сформируй краткую сводку по рынку за Q3 2025",
    tags: ["Казахский", "Русский", "Английский", "+1"],
    isLocal: true,
    icon: Sparkles,
    featured: true,
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
  },
  {
    id: "Assistant Pro",
    name: "Assistant Pro",
    description: "Корпоративный ассистент для предприятий",
    category: ["assistant"],
    type: "agent",
    instructions: "Корпоративный ассистент. Помогай с внутренними процессами, оформляй ответы в виде нумерованных шагов и чек-листов.",
    placeholder: "Составь шаблон онбординга для нового сотрудника",
    tags: ["HR", "Документооборот", "Планирование"],
    isLocal: true,
    icon: Briefcase,
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
  },
  {
    id: "Doc AI",
    name: "Doc AI",
    description: "Специализированный анализ документации",
    category: ["documents"],
    type: "agent",
    instructions: "Анализ документов РК. Извлекай ключевые положения, даты, ответственных и ссылки на статьи нормативных актов.",
    placeholder: "Извлеки ключевые требования из прикрепленного договора",
    tags: ["Госдокументы", "Правовые акты", "OCR"],
    isLocal: true,
    icon: FileText,
    gradient: "from-green-500/20 via-emerald-500/10 to-transparent",
  },
  {
    id: "Long-Name-Test",
    name: "Суверенная модель для корпоративного сектора с поддержкой множества языков и расширенными возможностями",
    description: "Высокоточная многоязычная модель искусственного интеллекта, специально разработанная для корпоративного сектора с расширенными возможностями обработки естественного языка и поддержкой более 50 языков, включая редкие диалекты и специализированные терминологии",
    category: ["language"],
    type: "agent",
    instructions: "Высокоточная многоязычная модель для корпоративных задач.",
    placeholder: "Тестовый промпт",
    tags: ["Тест"],
    isLocal: true,
    icon: Sparkles,
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
  },
  {
    id: "Long-Desc-Test",
    name: "Корпоративный интеллектуальный ассистент",
    description: "Мощный корпоративный ассистент, предназначенный для автоматизации внутренних процессов предприятий, управления документами, планирования задач и координации работы команд с использованием передовых технологий искусственного интеллекта и машинного обучения для повышения эффективности бизнес-операций",
    category: ["assistant"],
    type: "agent",
    instructions: "Корпоративный ассистент.",
    placeholder: "Тестовый промпт",
    tags: ["Тест"],
    isLocal: true,
    icon: Briefcase,
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
  },
  {
    id: "Code Assistant",
    name: "Code Assistant",
    description: "Помощник программиста для разработки",
    category: ["code"],
    type: "agent",
    instructions: "Инженер-программист. Пиши код с комментариями, предлагай тесты и указывай сложность алгоритмов.",
    placeholder: "Напиши функцию на TypeScript для валидации ИИН",
    tags: ["Python", "JavaScript", "Код-ревью"],
    isLocal: false,
    icon: Code,
    gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
  },
  {
    id: "Translation Master",
    name: "Translation Master",
    description: "Профессиональный переводчик с поддержкой множества языков",
    category: ["language"],
    type: "agent",
    instructions: "Профессиональный переводчик. Обеспечивай точный перевод с сохранением контекста и стиля оригинала.",
    placeholder: "Переведи техническую документацию с английского на казахский",
    tags: ["Казахский", "Русский", "Английский", "+15 языков"],
    isLocal: true,
    icon: Languages,
    gradient: "from-indigo-500/20 via-blue-500/10 to-transparent",
  },
  {
    id: "Data Analyst",
    name: "Data Analyst",
    description: "Специалист по анализу данных и бизнес-метрикам",
    category: ["industrial"],
    type: "agent",
    instructions: "Аналитик данных. Анализируй данные, создавай визуализации, находи паттерны и делай выводы на основе статистики.",
    placeholder: "Проанализируй продажи за последний квартал и выяви тренды",
    tags: ["SQL", "Python", "Визуализация"],
    isLocal: true,
    icon: BarChart3,
    gradient: "from-teal-500/20 via-cyan-500/10 to-transparent",
  },
  {
    id: "Legal Advisor",
    name: "Legal Advisor",
    description: "Юридический консультант по законодательству РК",
    category: ["documents"],
    type: "agent",
    instructions: "Юридический консультант. Анализируй правовые документы, давай рекомендации на основе законодательства РК.",
    placeholder: "Проанализируй договор на соответствие законодательству РК",
    tags: ["Гражданское право", "Трудовое право", "Налоговое право"],
    isLocal: true,
    icon: Scale,
    gradient: "from-red-500/20 via-rose-500/10 to-transparent",
  },
  {
    id: "Content Creator",
    name: "Content Creator",
    description: "Создатель контента для маркетинга и брендинга",
    category: ["assistant"],
    type: "agent",
    instructions: "Копирайтер и контент-маркетолог. Создавай убедительные тексты, статьи, посты для соцсетей с учетом целевой аудитории.",
    placeholder: "Напиши пост для LinkedIn о новых возможностях AI",
    tags: ["Копирайтинг", "SMM", "SEO"],
    isLocal: false,
    icon: PenTool,
    gradient: "from-pink-500/20 via-fuchsia-500/10 to-transparent",
  },
  {
    id: "Financial Advisor",
    name: "Financial Advisor",
    description: "Финансовый консультант и аналитик",
    category: ["industrial"],
    type: "agent",
    instructions: "Финансовый консультант. Анализируй финансовые показатели, составляй прогнозы, давай рекомендации по инвестициям.",
    placeholder: "Проанализируй финансовую отчетность компании за год",
    tags: ["Бухгалтерия", "Инвестиции", "Аналитика"],
    isLocal: true,
    icon: DollarSign,
    gradient: "from-yellow-500/20 via-amber-500/10 to-transparent",
  },
  {
    id: "Customer Support",
    name: "Customer Support",
    description: "Виртуальный помощник службы поддержки",
    category: ["assistant"],
    type: "agent",
    instructions: "Специалист поддержки клиентов. Отвечай вежливо, решай проблемы клиентов, предоставляй информацию о продуктах и услугах.",
    placeholder: "Клиент спрашивает о возврате товара, как помочь?",
    tags: ["Чат-бот", "FAQ", "Тикеты"],
    isLocal: true,
    icon: Headphones,
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
  },
  {
    id: "Research Assistant",
    name: "Research Assistant",
    description: "Помощник для научных исследований и анализа",
    category: ["industrial"],
    type: "developer",
    instructions: "Исследовательский ассистент. Проводи исследования, анализируй источники, составляй обзоры литературы и научные отчеты.",
    placeholder: "Подготовь обзор современных методов машинного обучения",
    tags: ["Академия", "Литература", "Цитирование"],
    isLocal: false,
    icon: GraduationCap,
    gradient: "from-slate-500/20 via-gray-500/10 to-transparent",
  },
  {
    id: "Security Auditor",
    name: "Security Auditor",
    description: "Специалист по кибербезопасности и аудиту",
    category: ["code"],
    type: "developer",
    instructions: "Аудитор безопасности. Проверяй код и системы на уязвимости, давай рекомендации по безопасности и соответствию стандартам.",
    placeholder: "Проверь этот код на уязвимости безопасности",
    tags: ["Пентест", "Уязвимости", "Compliance"],
    isLocal: true,
    icon: Shield,
    gradient: "from-emerald-500/20 via-green-500/10 to-transparent",
  },
  {
    id: "Project Manager",
    name: "Project Manager",
    description: "Помощник в управлении проектами и задачами",
    category: ["assistant"],
    type: "developer",
    instructions: "Проектный менеджер. Помогай планировать проекты, составлять задачи, отслеживать прогресс и управлять ресурсами.",
    placeholder: "Создай план проекта по внедрению новой системы",
    tags: ["Agile", "Scrum", "Планирование"],
    isLocal: true,
    icon: Kanban,
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
  },
];

const categories: { key: AgentCategory; label: string; count: number; icon: LucideIcon }[] = [
  { key: "all", label: "Все", count: agents.length, icon: Grid3x3 },
  { key: "language", label: "Языковые модели", count: agents.filter(a => a.category.includes("language")).length, icon: Languages },
  { key: "assistant", label: "Корпоративный ассистент", count: agents.filter(a => a.category.includes("assistant")).length, icon: Briefcase },
  { key: "documents", label: "Документы", count: agents.filter(a => a.category.includes("documents")).length, icon: FileText },
  { key: "code", label: "Код", count: agents.filter(a => a.category.includes("code")).length, icon: Code },
  { key: "industrial", label: "Промышленные", count: agents.filter(a => a.category.includes("industrial")).length, icon: Factory },
];

export default function AIStudio3() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<AgentCategory>("all");
  const [selectedType, setSelectedType] = useState<AgentType>("agent");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for smooth animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Фильтрация агентов
  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      // Фильтр по типу (агенты/разработчики)
      if (agent.type !== selectedType) return false;

      // Фильтр по категории
      if (selectedCategory !== "all" && !agent.category.includes(selectedCategory)) {
        return false;
      }

      // Фильтр по поисковому запросу
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          agent.name.toLowerCase().includes(query) ||
          agent.description.toLowerCase().includes(query) ||
          agent.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedType]);

  // Trigger animation when filtered agents change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [filteredAgents.length]);

  // Обновление счетчиков категорий
  const categoryCounts = useMemo(() => {
    const counts: Record<AgentCategory, number> = {
      all: agents.filter(a => a.type === selectedType).length,
      language: agents.filter(a => a.type === selectedType && a.category.includes("language")).length,
      assistant: agents.filter(a => a.type === selectedType && a.category.includes("assistant")).length,
      documents: agents.filter(a => a.type === selectedType && a.category.includes("documents")).length,
      code: agents.filter(a => a.type === selectedType && a.category.includes("code")).length,
      industrial: agents.filter(a => a.type === selectedType && a.category.includes("industrial")).length,
    };
    return counts;
  }, [selectedType]);

  // Обработчик клика на карточку агента
  const handleCardClick = (e: React.MouseEvent, agent: Agent) => {
    // Не открываем чат, если клик был на бейдж оценки или внутри диалога
    if ((e.target as HTMLElement).closest('[data-rating-badge]') || 
        (e.target as HTMLElement).closest('[role="dialog"]')) {
      return;
    }
    navigate('/ai-studio-3-chat', {
      state: {
        agent: agent.name,
        instructions: agent.instructions,
        placeholder: agent.placeholder,
      }
    });
  };
  
  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title="AI-Studio"
      />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-7xl mx-auto space-y-6 p-6">
          {/* Search Section */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('ai-studio.search')}
              className="pl-10 transition-all focus:ring-2 focus:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Категории</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const CategoryIcon = cat.icon;
                return (
                  <Badge
                    key={cat.key}
                    variant={selectedCategory === cat.key ? "default" : "secondary"}
                    className={cn(
                      "cursor-pointer transition-all duration-200 px-3 py-1.5 flex items-center gap-2",
                      selectedCategory === cat.key 
                        ? "ring-2 ring-primary ring-offset-2 shadow-lg scale-105" 
                        : "hover:scale-105 hover:bg-muted"
                    )}
                    onClick={() => setSelectedCategory(cat.key)}
                  >
                    <CategoryIcon className="h-3.5 w-3.5" />
                    <span>{cat.label}</span>
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full",
                      selectedCategory === cat.key 
                        ? "bg-primary-foreground/20 text-primary-foreground" 
                        : "bg-muted-foreground/20 text-muted-foreground"
                    )}>
                      {categoryCounts[cat.key]}
                    </span>
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Тип агентов</span>
            </div>
            <div className="flex gap-3">
              <Button
                variant={selectedType === "agent" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedType("agent")}
                className={cn(
                  "transition-all duration-200",
                  selectedType === "agent" 
                    ? "ring-2 ring-primary ring-offset-2 shadow-lg" 
                    : "hover:bg-muted"
                )}
              >
                <Users className="h-4 w-4 mr-2" />
                {t('ai-studio.agents')} ({categoryCounts.all})
              </Button>
              <Button
                variant={selectedType === "developer" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedType("developer")}
                className={cn(
                  "transition-all duration-200",
                  selectedType === "developer" 
                    ? "ring-2 ring-primary ring-offset-2 shadow-lg" 
                    : "hover:bg-muted"
                )}
              >
                <Code className="h-4 w-4 mr-2" />
                {t('ai-studio.developers')} ({agents.filter(a => a.type === "developer").length})
              </Button>
            </div>
          </div>

          {/* Models Grid */}
          {filteredAgents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-2">Агенты не найдены</p>
              <p className="text-sm text-muted-foreground">
                Попробуйте изменить фильтры или поисковый запрос
              </p>
            </div>
          ) : isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {[...Array(10)].map((_, index) => (
                <Card key={index} className="overflow-hidden h-[140px]" style={{ borderRadius: '20px' }}>
              <CardHeader className="p-3 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="skeleton h-7 w-7" style={{ borderRadius: '10px' }} />
                      <div className="skeleton h-4 w-20 rounded" />
                    </div>
                    <div className="skeleton h-3 w-full rounded mb-1 flex-1" />
                    <div className="skeleton h-3 w-3/4 rounded mb-2" />
                    <div className="flex flex-wrap gap-1 mt-auto">
                      <div className="skeleton h-4 w-14" style={{ borderRadius: '6px' }} />
                      <div className="skeleton h-4 w-12" style={{ borderRadius: '6px' }} />
                </div>
              </CardHeader>
            </Card>
              ))}
            </div>
          ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {filteredAgents.map((agent, index) => {
                const Icon = agent.icon;
                return (
            <Card
                  key={agent.id}
              className={cn(
                "card-glow relative overflow-hidden transition-all duration-300 cursor-pointer group h-[140px]",
                "hover:scale-[1.02] hover:shadow-lg",
                agent.featured && "ring-1 ring-primary/40"
              )}
              style={{
                animationDelay: `${index * 30}ms`,
                animation: "fadeInUp 0.4s ease-out forwards",
                opacity: 0,
                borderRadius: '20px',
              }}
              onClick={(e) => handleCardClick(e, agent)}
            >
              {/* Gradient background */}
              {agent.gradient && (
                <div className={cn(
                  "card-gradient absolute inset-0 bg-gradient-to-br transition-opacity duration-300",
                  agent.gradient,
                  "opacity-0 group-hover:opacity-100"
                )} 
                style={{ borderRadius: '20px' }}
                />
              )}
              
              <CardHeader className="p-3 relative z-10 h-full flex flex-col">
                {/* Info icon with tooltip */}
                <div className="absolute top-2 right-2 z-[100]">
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <span
                          role="button"
                          tabIndex={0}
                          aria-label={`Info: ${agent.name}`}
                          className="inline-flex p-1 rounded-md hover:bg-muted/50 transition-opacity opacity-[0.15] group-hover:opacity-100"
                          onPointerDown={(e) => {
                            e.stopPropagation();
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                        >
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={8} className="max-w-xs z-[99999]">
                        <div className="space-y-1">
                          <p className="font-semibold text-sm">{agent.name}</p>
                          <p className="text-sm text-muted-foreground whitespace-normal">{agent.description}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={cn(
                    "p-1.5 transition-all duration-300",
                    agent.featured 
                      ? "bg-primary/20 text-primary group-hover:bg-primary/30 group-hover:scale-110" 
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-110"
                  )}
                  style={{ borderRadius: '10px' }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold group-hover:text-primary transition-colors truncate flex-1 min-w-0">
                    {agent.name}
                  </CardTitle>
                </div>
                <CardDescription 
                  className="text-xs mb-2 flex-1 min-w-0"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: '1.3em',
                    maxHeight: '2.6em'
                  }}
                >
                  {agent.description}
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-auto">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1.5 py-0",
                      agent.isLocal
                        ? "bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-300 border-green-400/50 dark:border-green-500/50"
                        : "bg-blue-500/20 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300 border-blue-400/50 dark:border-blue-500/50"
                    )}
                    style={{ borderRadius: '6px' }}
                  >
                    {agent.isLocal ? "Локальный" : "Внешний"}
                  </Badge>
                  {agent.tags.slice(0, 1).map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-[10px] px-1.5 py-0" style={{ borderRadius: '6px' }}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
              )})}
                </div>
          )}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

