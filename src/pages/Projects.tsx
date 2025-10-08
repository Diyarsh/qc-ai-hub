import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, BarChart3, Flame, Link, MessageCircle, FileText, Command } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";

const projects = [
  { id: 1, name: "QazDoc Analyzer", icon: "📄", type: "document" },
  { id: 2, name: "KazLLM Assistant", icon: "💬", type: "chat" },
  { id: 3, name: "Business Analytics", icon: "📊", type: "analytics" }
];

const getProjectIcon = (type: string) => {
  switch (type) {
    case 'analytics': return <BarChart3 className="h-8 w-8 text-blue-500" />;
    case 'new': return <Flame className="h-8 w-8 text-orange-500" />;
    case 'link': return <Link className="h-8 w-8 text-gray-500" />;
    case 'chat': return <MessageCircle className="h-8 w-8 text-green-500" />;
    case 'document': return <FileText className="h-8 w-8 text-purple-500" />;
    default: return <Command className="h-8 w-8 text-blue-500" />;
  }
};

export default function Projects() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title={t('projects.title')}
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t('projects.create')}
          </Button>
        }
      />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="default" size="sm">
                {t('projects.my')}
              </Button>
              <Button variant="ghost" size="sm">
                {t('projects.shared')}
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`${t('projects.search')} ⌘K`}
                className="w-80 pl-10"
              />
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      {getProjectIcon(project.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-xs">{project.name}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}