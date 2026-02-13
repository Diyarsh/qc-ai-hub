import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Briefcase,
  FileText,
  Code,
  BarChart3,
  Brain,
  Zap,
  Database,
  Shield,
  Globe,
  MessageSquare,
  Settings,
  Rocket,
  Target,
  Lightbulb,
  Puzzle,
  Layers,
  Cpu,
  Network,
  GitBranch,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const iconLibrary: { name: string; icon: LucideIcon; category: string }[] = [
  { name: "Sparkles", icon: Sparkles, category: "General" },
  { name: "Briefcase", icon: Briefcase, category: "Business" },
  { name: "FileText", icon: FileText, category: "Documents" },
  { name: "Code", icon: Code, category: "Development" },
  { name: "BarChart3", icon: BarChart3, category: "Analytics" },
  { name: "Brain", icon: Brain, category: "AI" },
  { name: "Zap", icon: Zap, category: "General" },
  { name: "Database", icon: Database, category: "Data" },
  { name: "Shield", icon: Shield, category: "Security" },
  { name: "Globe", icon: Globe, category: "General" },
  { name: "MessageSquare", icon: MessageSquare, category: "Communication" },
  { name: "Settings", icon: Settings, category: "General" },
  { name: "Rocket", icon: Rocket, category: "General" },
  { name: "Target", icon: Target, category: "Business" },
  { name: "Lightbulb", icon: Lightbulb, category: "General" },
  { name: "Puzzle", icon: Puzzle, category: "General" },
  { name: "Layers", icon: Layers, category: "General" },
  { name: "Cpu", icon: Cpu, category: "Technology" },
  { name: "Network", icon: Network, category: "Technology" },
  { name: "GitBranch", icon: GitBranch, category: "Development" },
];

interface IconPickerProps {
  selectedIcon?: LucideIcon;
  onIconSelect: (icon: LucideIcon) => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function IconPicker({ selectedIcon, onIconSelect, trigger, open: controlledOpen, onOpenChange }: IconPickerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalOpen(value);
    }
  };

  const handleIconClick = (icon: LucideIcon) => {
    onIconSelect(icon);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Выберите иконку проекта</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Сетка иконок */}
          <div className="grid grid-cols-5 gap-3 max-h-[400px] overflow-y-auto">
            {iconLibrary.map((item, index) => {
              const Icon = item.icon;
              const isSelected = selectedIcon === Icon;
              return (
                <button
                  key={index}
                  onClick={() => handleIconClick(Icon)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all",
                    "hover:bg-muted hover:scale-105",
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border/50"
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
