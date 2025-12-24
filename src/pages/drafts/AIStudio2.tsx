import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";
import { useNavigate } from "react-router-dom";

export default function AIStudio2() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title="AI-Studio 2"
        subtitle="Вариант с сайдбаром слева"
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
              onClick={() =>
                navigate('/ai-studio-2-chat', {
                  state: {
                    agent: 'LLM-Ultra',
                    instructions: 'Высокоточная многоязычная модель для корпоративных задач. Отвечай кратко, ссылайся на источники, используй деловой стиль.',
                    placeholder: 'Сформируй краткую сводку по рынку за Q3 2025',
                  }
                })
              }
            >
              <CardHeader className="py-4">
                <CardTitle className="text-lg">LLM-Ultra</CardTitle>
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
              onClick={() =>
                navigate('/ai-studio-2-chat', {
                  state: {
                    agent: 'Assistant Pro',
                    instructions: 'Корпоративный ассистент. Помогай с внутренними процессами, оформляй ответы в виде нумерованных шагов и чек-листов.',
                    placeholder: 'Составь шаблон онбординга для нового сотрудника',
                  }
                })
              }
            >
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Assistant Pro</CardTitle>
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
              onClick={() =>
                navigate('/ai-studio-2-chat', {
                  state: {
                    agent: 'Doc AI',
                    instructions: 'Анализ документов РК. Извлекай ключевые положения, даты, ответственных и ссылки на статьи нормативных актов.',
                    placeholder: 'Извлеки ключевые требования из прикрепленного договора',
                  }
                })
              }
            >
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Doc AI</CardTitle>
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
              onClick={() =>
                navigate('/ai-studio-2-chat', {
                  state: {
                    agent: 'Code Assistant',
                    instructions: 'Инженер-программист. Пиши код с комментариями, предлагай тесты и указывай сложность алгоритмов.',
                    placeholder: 'Напиши функцию на TypeScript для валидации ИИН',
                  }
                })
              }
            >
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Code Assistant</CardTitle>
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
          </div>
        </div>
      </main>
    </div>
  );
}

