import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";
import { useNavigate } from "react-router-dom";
import { AgentRatingBadge } from "@/components/agent/AgentRatingBadge";
import { AgentEvaluationService } from "@/services/agent-evaluation.service";
import { useEffect } from "react";

export default function AIStudio3() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Инициализируем мокапные данные при загрузке страницы
  useEffect(() => {
    AgentEvaluationService.initializeMockData();
  }, []);

  // Обработчик клика на карточку агента - предотвращает открытие чата при клике на бейдж оценки
  const handleCardClick = (e: React.MouseEvent, agentData: { agent: string; instructions: string; placeholder: string }) => {
    // Не открываем чат, если клик был на бейдж оценки или внутри диалога
    if ((e.target as HTMLElement).closest('[data-rating-badge]') || 
        (e.target as HTMLElement).closest('[role="dialog"]')) {
      return;
    }
    navigate('/ai-studio-3-chat', { state: agentData });
  };
  
  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title="AI-Studio"
        subtitle="Вариант с сайдбаром справа"
      />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('ai-studio.search')}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="default">{t('ai-studio.all')} (12)</Badge>
            <Badge variant="secondary">{t('ai-studio.language')} (2)</Badge>
            <Badge variant="secondary">{t('ai-studio.assistant')} (3)</Badge>
            <Badge variant="secondary">{t('ai-studio.documents')} (3)</Badge>
            <Badge variant="secondary">{t('ai-studio.code')} (2)</Badge>
            <Badge variant="secondary">{t('ai-studio.industrial')} (2)</Badge>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <Button variant="default" size="sm">{t('ai-studio.agents')} (6)</Button>
            <Button variant="ghost" size="sm">{t('ai-studio.developers')} (6)</Button>
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* LLM-Ultra */}
            <Card
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              onClick={(e) => handleCardClick(e, {
                agent: 'LLM-Ultra',
                instructions: 'Высокоточная многоязычная модель для корпоративных задач. Отвечай кратко, ссылайся на источники, используй деловой стиль.',
                placeholder: 'Сформируй краткую сводку по рынку за Q3 2025',
              })}
            >
              <CardHeader className="py-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">LLM-Ultra</CardTitle>
                  <AgentRatingBadge agentId="LLM-Ultra" />
                </div>
                <CardDescription className="text-sm">
                  Суверенная модель для корпоративного сектора
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">Казахский</Badge>
                  <Badge variant="outline" className="text-xs">Русский</Badge>
                  <Badge variant="outline" className="text-xs">Английский</Badge>
                  <Badge variant="outline" className="text-xs">+1</Badge>
                  <Badge variant="outline" className="text-xs bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-300 border-green-400/50 dark:border-green-500/50">Локальный</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Other models would follow similar pattern */}
            <Card
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              onClick={(e) => handleCardClick(e, {
                agent: 'Assistant Pro',
                instructions: 'Корпоративный ассистент. Помогай с внутренними процессами, оформляй ответы в виде нумерованных шагов и чек-листов.',
                placeholder: 'Составь шаблон онбординга для нового сотрудника',
              })}
            >
              <CardHeader className="py-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">Assistant Pro</CardTitle>
                  <AgentRatingBadge agentId="Assistant Pro" />
                </div>
                <CardDescription className="text-sm">
                  Корпоративный ассистент для предприятий
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">HR</Badge>
                  <Badge variant="outline" className="text-xs">Документооборот</Badge>
                  <Badge variant="outline" className="text-xs">Планирование</Badge>
                  <Badge variant="outline" className="text-xs bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-300 border-green-400/50 dark:border-green-500/50">Локальный</Badge>
                </div>
              </CardHeader>
            </Card>

            <Card
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              onClick={(e) => handleCardClick(e, {
                agent: 'Doc AI',
                instructions: 'Анализ документов РК. Извлекай ключевые положения, даты, ответственных и ссылки на статьи нормативных актов.',
                placeholder: 'Извлеки ключевые требования из прикрепленного договора',
              })}
            >
              <CardHeader className="py-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">Doc AI</CardTitle>
                  <AgentRatingBadge agentId="Doc AI" />
                </div>
                <CardDescription className="text-sm">
                  Специализированный анализ документации
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">Госдокументы</Badge>
                  <Badge variant="outline" className="text-xs">Правовые акты</Badge>
                  <Badge variant="outline" className="text-xs">OCR</Badge>
                  <Badge variant="outline" className="text-xs bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-300 border-green-400/50 dark:border-green-500/50">Локальный</Badge>
                </div>
              </CardHeader>
            </Card>

            <Card
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              onClick={(e) => handleCardClick(e, {
                agent: 'Code Assistant',
                instructions: 'Инженер-программист. Пиши код с комментариями, предлагай тесты и указывай сложность алгоритмов.',
                placeholder: 'Напиши функцию на TypeScript для валидации ИИН',
              })}
            >
              <CardHeader className="py-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">Code Assistant</CardTitle>
                  <AgentRatingBadge agentId="Code Assistant" />
                </div>
                <CardDescription className="text-sm">
                  Помощник программиста для разработки
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">Python</Badge>
                  <Badge variant="outline" className="text-xs">JavaScript</Badge>
                  <Badge variant="outline" className="text-xs">Код-ревью</Badge>
                  <Badge variant="outline" className="text-xs bg-blue-500/20 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300 border-blue-400/50 dark:border-blue-500/50">Внешний</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Translation Master */}
            <Card
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              onClick={(e) => handleCardClick(e, {
                agent: 'Translation Master',
                instructions: 'Профессиональный переводчик. Обеспечивай точный перевод с сохранением контекста и стиля оригинала.',
                placeholder: 'Переведи техническую документацию с английского на казахский',
              })}
            >
              <CardHeader className="py-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">Translation Master</CardTitle>
                  <AgentRatingBadge agentId="Translation Master" />
                </div>
                <CardDescription className="text-sm">
                  Профессиональный переводчик с поддержкой множества языков
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">Казахский</Badge>
                  <Badge variant="outline" className="text-xs">Русский</Badge>
                  <Badge variant="outline" className="text-xs">Английский</Badge>
                  <Badge variant="outline" className="text-xs">+15 языков</Badge>
                  <Badge variant="outline" className="text-xs bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-300 border-green-400/50 dark:border-green-500/50">Локальный</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Data Analyst */}
            <Card
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              onClick={(e) => handleCardClick(e, {
                agent: 'Data Analyst',
                instructions: 'Аналитик данных. Анализируй данные, создавай визуализации, находи паттерны и делай выводы на основе статистики.',
                placeholder: 'Проанализируй продажи за последний квартал и выяви тренды',
              })}
            >
              <CardHeader className="py-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">Data Analyst</CardTitle>
                  <AgentRatingBadge agentId="Data Analyst" />
                </div>
                <CardDescription className="text-sm">
                  Специалист по анализу данных и бизнес-метрикам
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">SQL</Badge>
                  <Badge variant="outline" className="text-xs">Python</Badge>
                  <Badge variant="outline" className="text-xs">Визуализация</Badge>
                  <Badge variant="outline" className="text-xs bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-300 border-green-400/50 dark:border-green-500/50">Локальный</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Legal Advisor */}
            <Card
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              onClick={(e) => handleCardClick(e, {
                agent: 'Legal Advisor',
                instructions: 'Юридический консультант. Анализируй правовые документы, давай рекомендации на основе законодательства РК.',
                placeholder: 'Проанализируй договор на соответствие законодательству РК',
              })}
            >
              <CardHeader className="py-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">Legal Advisor</CardTitle>
                  <AgentRatingBadge agentId="Legal Advisor" />
                </div>
                <CardDescription className="text-sm">
                  Юридический консультант по законодательству РК
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">Гражданское право</Badge>
                  <Badge variant="outline" className="text-xs">Трудовое право</Badge>
                  <Badge variant="outline" className="text-xs">Налоговое право</Badge>
                  <Badge variant="outline" className="text-xs bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-300 border-green-400/50 dark:border-green-500/50">Локальный</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Content Creator */}
            <Card
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              onClick={(e) => handleCardClick(e, {
                agent: 'Content Creator',
                instructions: 'Копирайтер и контент-маркетолог. Создавай убедительные тексты, статьи, посты для соцсетей с учетом целевой аудитории.',
                placeholder: 'Напиши пост для LinkedIn о новых возможностях AI',
              })}
            >
              <CardHeader className="py-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">Content Creator</CardTitle>
                  <AgentRatingBadge agentId="Content Creator" />
                </div>
                <CardDescription className="text-sm">
                  Создатель контента для маркетинга и брендинга
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">Копирайтинг</Badge>
                  <Badge variant="outline" className="text-xs">SMM</Badge>
                  <Badge variant="outline" className="text-xs">SEO</Badge>
                  <Badge variant="outline" className="text-xs bg-blue-500/20 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300 border-blue-400/50 dark:border-blue-500/50">Внешний</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Financial Advisor */}
            <Card
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              onClick={(e) => handleCardClick(e, {
                agent: 'Financial Advisor',
                instructions: 'Финансовый консультант. Анализируй финансовые показатели, составляй прогнозы, давай рекомендации по инвестициям.',
                placeholder: 'Проанализируй финансовую отчетность компании за год',
              })}
            >
              <CardHeader className="py-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">Financial Advisor</CardTitle>
                  <AgentRatingBadge agentId="Financial Advisor" />
                </div>
                <CardDescription className="text-sm">
                  Финансовый консультант и аналитик
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">Бухгалтерия</Badge>
                  <Badge variant="outline" className="text-xs">Инвестиции</Badge>
                  <Badge variant="outline" className="text-xs">Аналитика</Badge>
                  <Badge variant="outline" className="text-xs bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-300 border-green-400/50 dark:border-green-500/50">Локальный</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Customer Support */}
            <Card
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              onClick={(e) => handleCardClick(e, {
                agent: 'Customer Support',
                instructions: 'Специалист поддержки клиентов. Отвечай вежливо, решай проблемы клиентов, предоставляй информацию о продуктах и услугах.',
                placeholder: 'Клиент спрашивает о возврате товара, как помочь?',
              })}
            >
              <CardHeader className="py-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">Customer Support</CardTitle>
                  <AgentRatingBadge agentId="Customer Support" />
                </div>
                <CardDescription className="text-sm">
                  Виртуальный помощник службы поддержки
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">Чат-бот</Badge>
                  <Badge variant="outline" className="text-xs">FAQ</Badge>
                  <Badge variant="outline" className="text-xs">Тикеты</Badge>
                  <Badge variant="outline" className="text-xs bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-300 border-green-400/50 dark:border-green-500/50">Локальный</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Research Assistant */}
            <Card
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              onClick={(e) => handleCardClick(e, {
                agent: 'Research Assistant',
                instructions: 'Исследовательский ассистент. Проводи исследования, анализируй источники, составляй обзоры литературы и научные отчеты.',
                placeholder: 'Подготовь обзор современных методов машинного обучения',
              })}
            >
              <CardHeader className="py-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">Research Assistant</CardTitle>
                  <AgentRatingBadge agentId="Research Assistant" />
                </div>
                <CardDescription className="text-sm">
                  Помощник для научных исследований и анализа
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">Академия</Badge>
                  <Badge variant="outline" className="text-xs">Литература</Badge>
                  <Badge variant="outline" className="text-xs">Цитирование</Badge>
                  <Badge variant="outline" className="text-xs bg-blue-500/20 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300 border-blue-400/50 dark:border-blue-500/50">Внешний</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Security Auditor */}
            <Card
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              onClick={(e) => handleCardClick(e, {
                agent: 'Security Auditor',
                instructions: 'Аудитор безопасности. Проверяй код и системы на уязвимости, давай рекомендации по безопасности и соответствию стандартам.',
                placeholder: 'Проверь этот код на уязвимости безопасности',
              })}
            >
              <CardHeader className="py-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">Security Auditor</CardTitle>
                  <AgentRatingBadge agentId="Security Auditor" />
                </div>
                <CardDescription className="text-sm">
                  Специалист по кибербезопасности и аудиту
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">Пентест</Badge>
                  <Badge variant="outline" className="text-xs">Уязвимости</Badge>
                  <Badge variant="outline" className="text-xs">Compliance</Badge>
                  <Badge variant="outline" className="text-xs bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-300 border-green-400/50 dark:border-green-500/50">Локальный</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Project Manager */}
            <Card
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              onClick={(e) => handleCardClick(e, {
                agent: 'Project Manager',
                instructions: 'Проектный менеджер. Помогай планировать проекты, составлять задачи, отслеживать прогресс и управлять ресурсами.',
                placeholder: 'Создай план проекта по внедрению новой системы',
              })}
            >
              <CardHeader className="py-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">Project Manager</CardTitle>
                  <AgentRatingBadge agentId="Project Manager" />
                </div>
                <CardDescription className="text-sm">
                  Помощник в управлении проектами и задачами
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">Agile</Badge>
                  <Badge variant="outline" className="text-xs">Scrum</Badge>
                  <Badge variant="outline" className="text-xs">Планирование</Badge>
                  <Badge variant="outline" className="text-xs bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-300 border-green-400/50 dark:border-green-500/50">Локальный</Badge>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

