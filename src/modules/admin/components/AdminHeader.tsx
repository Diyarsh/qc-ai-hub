import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/main/webapp/app/shared/hooks/useAuth";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function AdminHeader() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    if (setTheme) {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  const currentTheme = mounted ? (theme || "light") : "light";

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-4 sm:px-6 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="font-semibold text-lg text-foreground tracking-tight">QC AI-HUB Admin</div>
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="rounded-full bg-primary/10 text-primary px-3 py-1 font-medium text-xs border border-primary/20">
          ADMIN
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleThemeToggle}
          className="text-muted-foreground hover:text-foreground"
          aria-label={currentTheme === "dark" ? "Светлая тема" : "Тёмная тема"}
        >
          {currentTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-2">
          <Shield className="h-4 w-4" />
          Платформа
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </Button>
      </div>
    </header>
  );
}
