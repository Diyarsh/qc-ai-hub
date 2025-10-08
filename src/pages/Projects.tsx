import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";

const projects = [
  { id: 1, name: "QazDoc Analyzer", files: 24 },
  { id: 2, name: "KazLLM Assistant", files: 18 },
  { id: 3, name: "Business Analytics", files: 31 }
];

export default function Projects() {
  const { t } = useLanguage();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title={t('projects.title')}
        actions={
          <Button className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
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
                  <div className="flex flex-col text-center space-y-1">
                    <h3 className="font-medium text-sm">{project.name}</h3>
                    <p className="text-xs text-muted-foreground">{project.files} files</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <CreateProjectDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </div>
  );
}