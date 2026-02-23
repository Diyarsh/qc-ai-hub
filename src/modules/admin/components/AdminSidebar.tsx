import { NavLink } from "react-router-dom";
import { Shield, Users, Database, Brain, BarChart3, Cog, BookOpen, FileText, Building2, Briefcase } from "lucide-react";

export interface AdminSidebarProps {
  role: string;
}

const adminMenu = [
  { id: 'dashboard', label: 'Дашборд', icon: BarChart3, path: '/admin/dashboard', roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: 'users', label: 'Пользователи', icon: Users, path: '/admin/users', roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: 'llm-models', label: 'LLM Модели', icon: Database, path: '/admin/llm-models', roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: 'ai-agents', label: 'AI Агенты', icon: Brain, path: '/admin/ai-agents', roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: 'knowledge', label: 'База знаний', icon: BookOpen, path: '/admin/knowledge', roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: 'reports', label: 'Обратная связь агентов', icon: FileText, path: '/admin/reports', roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: 'companies', label: 'Компании', icon: Briefcase, path: '/admin/companies', roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: 'departments', label: 'Департаменты', icon: Building2, path: '/admin/departments', roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: 'system', label: 'Система', icon: Cog, path: '/admin/system', roles: ["ROLE_SUPER_ADMIN"] },
];

export function AdminSidebar({ role }: AdminSidebarProps) {
  return (
    <aside className="w-64 shrink-0 h-screen flex flex-col border-r border-border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center h-16 px-6 font-semibold text-base tracking-tight border-b border-border text-foreground">
        Админ-панель
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {adminMenu.filter((item) => item.roles.includes(role)).map(({ id, label, icon: Icon, path }) => (
          <NavLink
            to={path}
            key={id}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg my-0.5 transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
