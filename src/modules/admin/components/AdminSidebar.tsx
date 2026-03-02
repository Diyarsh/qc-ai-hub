import { NavLink } from "react-router-dom";
import { Users, Database, Brain, BarChart3, Cog, BookOpen, FileText, Building2, Briefcase, PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AdminSidebarProps {
  role: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

const adminMenu = [
  { id: "dashboard", label: "Дашборд", icon: BarChart3, path: "/admin/dashboard", roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: "users", label: "Пользователи", icon: Users, path: "/admin/users", roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: "llm-models", label: "LLM Модели", icon: Database, path: "/admin/llm-models", roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: "ai-agents", label: "AI Агенты", icon: Brain, path: "/admin/ai-agents", roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: "knowledge", label: "База знаний", icon: BookOpen, path: "/admin/knowledge", roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: "reports", label: "Обратная связь агентов", icon: FileText, path: "/admin/reports", roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: "companies", label: "Компании", icon: Briefcase, path: "/admin/companies", roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: "departments", label: "Департаменты", icon: Building2, path: "/admin/departments", roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: "system", label: "Система", icon: Cog, path: "/admin/system", roles: ["ROLE_SUPER_ADMIN"] },
];

export function AdminSidebar({ role, collapsed = false, onToggle }: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        "shrink-0 h-screen flex flex-col border-r border-border bg-card text-card-foreground shadow-sm transition-[width] duration-200",
        collapsed ? "w-[52px]" : "w-64"
      )}
    >
      <div className={cn("flex items-center h-16 border-b border-border text-foreground", collapsed ? "px-0 justify-center" : "px-3 gap-2")}>
        {!collapsed && <span className="font-semibold text-base tracking-tight truncate flex-1 min-w-0">Админ-панель</span>}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={onToggle}
          aria-label={collapsed ? "Открыть меню" : "Свернуть меню"}
        >
          {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {adminMenu.filter((item) => item.roles.includes(role)).map(({ id, label, icon: Icon, path }) => (
          <NavLink
            to={path}
            key={id}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 py-3 rounded-lg my-0.5 transition-all duration-200",
                collapsed ? "px-2 justify-center" : "px-4",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
