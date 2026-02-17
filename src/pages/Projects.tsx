import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreVertical, Edit, Share2, Check, FileText, MessageSquare, BarChart3, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { IconPicker } from "@/components/IconPicker";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Project {
  id: number;
  name: string;
  description: string;
  fileCount: number;
  icon?: LucideIcon;
  iconColor?: string;
}

const initialProjects: Project[] = [{
  id: 1,
  name: "Мои дейлики",
  description: "Ежедневные задачи и заметки",
  fileCount: 12,
  icon: FileText,
  iconColor: "text-green-500",
}, {
  id: 2,
  name: "КПД 1-ый квартал",
  description: "Ключевые показатели эффективности за первый квартал",
  fileCount: 8,
  icon: MessageSquare,
  iconColor: "text-indigo-500",
}, {
  id: 3,
  name: "КПД годовой",
  description: "Годовые ключевые показатели эффективности",
  fileCount: 15,
  icon: BarChart3,
  iconColor: "text-teal-500",
}];

export default function Projects() {
  const { t } = useLanguage();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingIconId, setEditingIconId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (editingId !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const startRename = (id: number, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditingName(currentName);
  };

  const confirmRename = (id: number) => {
    if (editingName.trim()) {
      setProjects(prev => prev.map(p => 
        p.id === id ? { ...p, name: editingName.trim() } : p
      ));
    }
    setEditingId(null);
    setEditingName("");
  };

  const handleIconChange = (id: number, icon: LucideIcon) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, icon } : p
    ));
    setEditingIconId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === "Enter") {
      confirmRename(id);
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditingName("");
    }
  };

  return <div className="flex flex-col h-full">
      <PageHeader title={t('projects.my')} />

      {/* Main Content */}
      <main className="flex-1 p-6 relative">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 right-0 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-3xl animate-breathe" />
          <div className="absolute bottom-0 -left-20 w-[350px] h-[350px] bg-primary/6 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-indigo-500/4 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '3s' }} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {projects.map(project => {
              const ProjectIcon = project.icon || FileText;
              return (
                <Card 
                  key={project.id} 
                  onClick={() => editingId !== project.id && editingIconId !== project.id && navigate('/project-chat', { state: { projectName: project.name } })} 
                  className={cn(
                    "group relative overflow-hidden transition-all duration-300 cursor-pointer card-glow",
                    "bg-card/60 backdrop-blur-sm border-border/30",
                    "hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/10",
                    "h-[150px]"
                  )}
                  style={{ borderRadius: '20px' }}
                >
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-60 group-hover:opacity-100 transition-opacity duration-300" style={{ borderRadius: '20px' }} />
                  {/* Top accent line */}
                  <div className="absolute top-0 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary/60 transition-all duration-300" />
                  <CardContent className="p-4 h-full flex flex-col gap-0 relative z-10">
                    <div className="flex gap-2.5 flex-1 min-h-0 items-start -mb-1">
                      <IconPicker
                        selectedIcon={project.icon}
                        onIconSelect={(icon) => {
                          handleIconChange(project.id, icon);
                          setEditingIconId(null);
                        }}
                        open={editingIconId === project.id}
                        onOpenChange={(isOpen) => {
                          setEditingIconId(isOpen ? project.id : null);
                        }}
                        trigger={
                          <div 
                            className={cn(
                              "relative flex-shrink-0 transition-all duration-500 flex items-center justify-center cursor-pointer group-hover:scale-110 group-hover:-translate-y-0.5",
                              editingIconId === project.id && "ring-2 ring-primary"
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                                  <div className="absolute inset-0 rounded-full bg-primary/10 blur-md scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                  <ProjectIcon className={cn("h-9 w-9 relative z-10", project.iconColor || "text-primary")} style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.2))' }} />
                          </div>
                        }
                      />
                      <div className="flex flex-col flex-1 min-w-0 gap-1 pt-0.5">
                        <div className="flex items-start justify-between gap-2">
                          {editingId === project.id ? (
                            <div className="flex items-center gap-2 flex-1 min-w-0" onClick={e => e.stopPropagation()}>
                              <Input
                                ref={inputRef}
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, project.id)}
                                onBlur={() => confirmRename(project.id)}
                                className="h-7 text-sm font-semibold"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 shrink-0"
                                onClick={() => confirmRename(project.id)}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <h3 className="text-sm font-semibold flex-1 truncate group-hover:text-primary transition-colors leading-tight">{project.name}</h3>
                          )}
                          {editingId !== project.id && editingIconId !== project.id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => startRename(project.id, project.name, e)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Переименовать
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={e => e.stopPropagation()}>
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Поделиться
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                        <CardDescription 
                          className="text-xs flex-1 min-w-0 text-muted-foreground leading-relaxed overflow-hidden"
                          style={{
                            lineHeight: '1.35em',
                            maxHeight: '2.7em',
                          }}
                        >
                          {project.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-nowrap gap-1.5 mt-auto pt-1 overflow-hidden min-w-0">
                      <Badge variant="outline" className="text-xs font-medium px-2.5 py-1 flex-shrink-0 whitespace-nowrap" style={{ borderRadius: '8px' }}>
                        {project.fileCount} файлов
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <CreateProjectDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>;
}
