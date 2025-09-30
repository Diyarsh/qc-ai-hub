import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, BarChart3, Flame, Link, MessageCircle, FileText, Command } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const projects = [
  { id: 1, name: "QC", icon: "🌐", type: "web" },
  { id: 2, name: "New Project", icon: "🔥", type: "new" },
  { id: 3, name: "New Project", icon: "🔗", type: "link" },
  { id: 4, name: "AI Assistant", icon: "💬", type: "chat" },
  { id: 5, name: "Document Processor", icon: "📄", type: "document" },
  { id: 6, name: "Data Analytics", icon: "📊", type: "analytics" }
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
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">{t('projects.title')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t('projects.create')}
          </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-md transition-all duration-200 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                      {getProjectIcon(project.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{project.name}</h3>
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