import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  name: "QazLLM-Ultra",
  description: "Суверенная казахская модель для корпоративного сектора Казахстана",
  tags: ["Казахский", "Русский", "Английский", "+1"]
}, {
  id: 2,
  name: "QazAssistant Pro",
  description: "Корпоративный ассистент для казахстанских предприятий",
  tags: ["HR", "Документооборот", "Планирование"]
}, {
  id: 3,
  name: "KazDoc AI",
  description: "Специализированный анализ казахстанской документации",
  tags: ["Госдокументы", "Правовые акты", "OCR"]
}, {
  id: 4,
  name: "KazCode Assistant",
  description: "Помощник программиста для разработки в Казахстане",
  tags: ["Python", "JavaScript", "Код-ревью"]
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
          <div className="flex items-center justify-between mb-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {projects.map(project => <Card key={project.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] flex flex-col">
                <CardContent className="p-5 flex flex-col flex-1">
                  <div className="flex flex-col h-full space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-base flex-1 line-clamp-1">{project.name}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 -mt-1 shrink-0">
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
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags.map((tag, index) => <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>)}
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </main>

      <CreateProjectDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>;
}