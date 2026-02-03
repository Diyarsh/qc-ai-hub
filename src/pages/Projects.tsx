import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Plus, MoreVertical, Edit, Share2, Check, FileText, MessageSquare, BarChart3, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { IconPicker, iconLibrary } from "@/components/IconPicker";
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
}

const initialProjects: Project[] = [{
  id: 1,
  name: "QazDoc Analyzer",
  description: "AI-powered document analysis and processing system for Kazakh documents",
  fileCount: 12,
  icon: FileText
}, {
  id: 2,
  name: "KazLLM Assistant",
  description: "Multilingual chatbot assistant with Kazakh language support",
  fileCount: 8,
  icon: MessageSquare
}, {
  id: 3,
  name: "Business Analytics",
  description: "Comprehensive business intelligence and analytics dashboard",
  fileCount: 15,
  icon: BarChart3
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {projects.map(project => {
              const ProjectIcon = project.icon || FileText;
              return (
                <Card 
                  key={project.id} 
                  onClick={() => editingId !== project.id && editingIconId !== project.id && navigate('/project-chat', { state: { projectName: project.name } })} 
                  className={cn(
                    "group relative overflow-hidden transition-all duration-300 cursor-pointer",
                    "bg-muted/30 hover:bg-muted/50 border-border/50",
                    "hover:scale-[1.02] hover:shadow-lg",
                    "h-[140px]"
                  )}
                  style={{ borderRadius: '20px' }}
                >
                  <CardContent className="p-3 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
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
                                "p-1.5 rounded-lg transition-all duration-300 flex-shrink-0 cursor-pointer",
                                "bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110",
                                editingIconId === project.id && "ring-2 ring-primary"
                              )}
                              style={{ borderRadius: '10px' }}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <ProjectIcon className="h-4 w-4" />
                            </div>
                          }
                        />
                        {editingId === project.id ? (
                          <div className="flex items-center gap-2 flex-1 min-w-0" onClick={e => e.stopPropagation()}>
                            <Input
                              ref={inputRef}
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, project.id)}
                              onBlur={() => confirmRename(project.id)}
                              className="h-7 text-xs font-semibold"
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
                          <h3 className="text-sm font-semibold flex-1 truncate group-hover:text-primary transition-colors">{project.name}</h3>
                        )}
                      </div>
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
                      {project.description}
                    </CardDescription>
                    <p className="text-xs text-muted-foreground">{project.fileCount} файлов</p>
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
