import { NavLink } from "react-router-dom";
import {
  Users,
  Database,
  Brain,
  BarChart3,
  Activity,
  Cog,
  BookOpen,
  FileText,
  Building2,
  Briefcase,
  PanelLeftClose,
  PanelLeft,
  LucideIcon,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AdminPermissions,
  SCOPE_LABEL,
  useAdminRole,
} from "@/contexts/AdminRoleContext";

export interface AdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

interface AdminMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  permission: keyof AdminPermissions;
}

const adminMenu: AdminMenuItem[] = [
  {
    id: "analytics",
    label: "Аналитика",
    icon: BarChart3,
    path: "/admin/analytics",
    permission: "analytics",
  },
  {
    id: "monitoring",
    label: "Мониторинг",
    icon: Activity,
    path: "/admin/monitoring",
    permission: "monitoring",
  },
  {
    id: "users",
    label: "Пользователи",
    icon: Users,
    path: "/admin/users",
    permission: "users",
  },
  {
    id: "llm-models",
    label: "LLM Модели",
    icon: Database,
    path: "/admin/llm-models",
    permission: "llmModels",
  },
  {
    id: "ai-agents",
    label: "AI Агенты",
    icon: Brain,
    path: "/admin/ai-agents",
    permission: "viewAIAgents",
  },
  {
    id: "knowledge",
    label: "База знаний",
    icon: BookOpen,
    path: "/admin/knowledge",
    permission: "viewKnowledge",
  },
  {
    id: "reports",
    label: "Обратная связь агентов",
    icon: FileText,
    path: "/admin/reports",
    permission: "reports",
  },
  {
    id: "companies",
    label: "Компании",
    icon: Briefcase,
    path: "/admin/companies",
    permission: "companies",
  },
  {
    id: "departments",
    label: "Департаменты",
    icon: Building2,
    path: "/admin/departments",
    permission: "departments",
  },
  {
    id: "system",
    label: "Система",
    icon: Cog,
    path: "/admin/system",
    permission: "llmModels",
  },
];

export function AdminSidebar({ collapsed = false, onToggle }: AdminSidebarProps) {
  const { role, getScope } = useAdminRole();

  return (
    <aside
      className={cn(
        "shrink-0 h-screen flex flex-col border-r border-border bg-card text-card-foreground shadow-sm transition-[width] duration-200",
        collapsed ? "w-[52px]" : "w-72",
      )}
    >
      <div
        className={cn(
          "flex items-center h-16 border-b border-border text-foreground",
          collapsed ? "px-0 justify-center" : "px-3 gap-2",
        )}
      >
        {!collapsed && (
          <span className="font-semibold text-base tracking-tight truncate flex-1 min-w-0">
            Админ-панель
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={onToggle}
          aria-label={collapsed ? "Открыть меню" : "Свернуть меню"}
        >
          {collapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {adminMenu.map(({ id, label, icon: Icon, path, permission }) => {
          const scope = getScope(permission);
          const accessible = scope !== "none";
          if (!accessible) {
            if (collapsed) return null;
            return (
              <div
                key={id}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg my-0.5 opacity-50 cursor-not-allowed select-none",
                )}
                title={`${label} — нет доступа для роли «${role.label}»`}
              >
                <Icon className="w-5 h-5 shrink-0 text-muted-foreground" />
                <span className="truncate flex-1 text-sm text-muted-foreground line-through decoration-muted-foreground/40">
                  {label}
                </span>
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            );
          }
          return (
            <NavLink
              to={path}
              key={id}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 py-2.5 rounded-lg my-0.5 transition-all duration-200",
                  collapsed ? "px-2 justify-center" : "px-4",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )
              }
              title={collapsed ? `${label} — ${SCOPE_LABEL[scope]}` : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <span className="truncate flex-1 text-sm">{label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
