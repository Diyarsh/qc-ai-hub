import { NavLink } from "react-router-dom";
import { Shield, Users, Database, Brain, BarChart3, Cog, BookOpen } from "lucide-react";

export interface AdminSidebarProps {
  role: string;
}

const adminMenu = [
  { id: 'dashboard', label: 'Дашборд', icon: BarChart3, path: '/admin/dashboard', roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: 'users', label: 'Пользователи', icon: Users, path: '/admin/users', roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: 'llm-models', label: 'LLM Модели', icon: Database, path: '/admin/llm-models', roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: 'ai-agents', label: 'AI Агенты', icon: Brain, path: '/admin/ai-agents', roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: 'knowledge', label: 'База знаний', icon: BookOpen, path: '/admin/knowledge', roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"] },
  { id: 'system', label: 'Система', icon: Cog, path: '/admin/system', roles: ["ROLE_SUPER_ADMIN"] },
];

export function AdminSidebar({ role }: AdminSidebarProps) {
  return (
    <aside className="w-64 h-screen bg-card text-foreground flex flex-col border-r border-border shadow">
      <div className="flex items-center h-16 px-6 font-bold text-lg tracking-tight border-b border-border text-foreground">Админ-панель</div>
      <nav className="flex-1 px-2 py-4">
        {adminMenu.filter(item => item.roles.includes(role)).map(({ id, label, icon: Icon, path }) => (
          <NavLink to={path} key={id}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-md my-1 transition-all duration-150 ${isActive ? "bg-muted text-primary" : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"}`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
