import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function AdminHeader() {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-card border-b border-border flex items-center px-8 justify-between">
      <div className="font-bold text-lg text-foreground">QC AI-HUB Admin</div>
      <div className="flex items-center gap-6">
        <div className="rounded-full bg-primary text-primary-foreground px-3 py-1 font-medium text-sm">ADMIN</div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/settings')}>
          Настройки
        </Button>
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          Выйти
        </Button>
      </div>
    </header>
  );
}
