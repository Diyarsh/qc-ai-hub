import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";

export default function AIStudio() {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title={t('ai-studio.title')}
        subtitle={t('ai-studio.subtitle')}
        actions={
          <Button variant="ghost" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            {t('ai-studio.filters')}
          </Button>
        }
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
            {/* QazLLM-Ultra */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="py-4">
                <CardTitle className="text-lg">QazLLM-Ultra</CardTitle>
                <CardDescription className="text-sm">
                  Суверенная казахская модель для корпоративного сектора Казахстана
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">Казахский</Badge>
                  <Badge variant="outline" className="text-xs">Русский</Badge>
                  <Badge variant="outline" className="text-xs">Английский</Badge>
                  <Badge variant="outline" className="text-xs">+1</Badge>
                </div>
                <Button className="w-full mt-3" size="sm">{t('ai-studio.use')}</Button>
              </CardHeader>
            </Card>

            {/* Other models would follow similar pattern */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="py-4">
                <CardTitle className="text-lg">QazAssistant Pro</CardTitle>
                <CardDescription className="text-sm">
                  Корпоративный ассистент для казахстанских предприятий
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">HR</Badge>
                  <Badge variant="outline" className="text-xs">Документооборот</Badge>
                  <Badge variant="outline" className="text-xs">Планирование</Badge>
                </div>
                <Button className="w-full mt-3" size="sm">{t('ai-studio.use')}</Button>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="py-4">
                <CardTitle className="text-lg">KazDoc AI</CardTitle>
                <CardDescription className="text-sm">
                  Специализированный анализ казахстанской документации
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">Госдокументы</Badge>
                  <Badge variant="outline" className="text-xs">Правовые акты</Badge>
                  <Badge variant="outline" className="text-xs">OCR</Badge>
                </div>
                <Button className="w-full mt-3" size="sm">{t('ai-studio.use')}</Button>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="py-4">
                <CardTitle className="text-lg">KazCode Assistant</CardTitle>
                <CardDescription className="text-sm">
                  Помощник программиста для разработки в Казахстане
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">Python</Badge>
                  <Badge variant="outline" className="text-xs">JavaScript</Badge>
                  <Badge variant="outline" className="text-xs">Код-ревью</Badge>
                </div>
                <Button className="w-full mt-3" size="sm">{t('ai-studio.use')}</Button>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}