import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, MoreVertical, Edit, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const projects = [{
  id: 1,
  name: "QazDoc Analyzer",
  description: "AI-powered document analysis and processing system for Kazakh documents",
  fileCount: 12
}, {
  id: 2,
  name: "KazLLM Assistant",
  description: "Multilingual chatbot assistant with Kazakh language support",
  fileCount: 8
}, {
  id: 3,
  name: "Business Analytics",
  description: "Comprehensive business intelligence and analytics dashboard",
  fileCount: 15
}];
export default function Projects() {
  const {
    t
  } = useLanguage();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  return <div className="flex flex-col h-full">
      <PageHeader title={t('projects.title')} />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b">
            <div className="flex items-center gap-4">
              <Button variant="default" size="sm">
                {t('projects.my')}
              </Button>
              <Button variant="ghost" size="sm">
                {t('projects.shared')}
              </Button>
            </div>
            
            <Button className="gap-2" size="sm" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              {t('projects.create')}
            </Button>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => <Card key={project.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-base flex-1">{project.name}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    <p className="text-xs text-muted-foreground">{project.fileCount} files</p>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </main>

      <CreateProjectDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>;
}