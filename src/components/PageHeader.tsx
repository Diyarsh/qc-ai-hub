import { Button } from "@/components/ui/button";
import { Sun, Moon, Code, Settings, Shield, HelpCircle, LogOut, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { DevModeToggle } from "@/components/DevModeToggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserSettingsDialog } from "@/components/UserSettingsDialog";
import { useAuth } from "@/main/webapp/app/shared/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userSettingsOpen, setUserSettingsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

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
    <header className="sticky top-0 flex flex-col sm:flex-row items-center justify-between gap-4 bg-background/95 backdrop-blur-sm border-b px-4 sm:px-6 py-4 h-[68px] z-50">
      <div className="flex items-center gap-3 w-full sm:w-auto min-h-[36px]">
        <div className="min-w-0 flex-1 flex flex-col justify-center">
          {title && (
            <h1 className="text-xl sm:text-2xl font-bold leading-tight truncate">{title}</h1>
          )}
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground truncate leading-tight mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end flex-nowrap relative z-20">
        {actions}
        <div className="relative z-30">
          <LanguageSelector />
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleThemeToggle}
          className="relative z-30 pointer-events-auto"
        >
          {currentTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        
        <div className="relative z-30">
          <DevModeToggle compact />
        </div>
        
        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              role="button"
              tabIndex={0}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-200"
            >
              <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="text-primary-foreground text-xs font-semibold">RL</span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Roman Lefarov</p>
                <p className="text-xs leading-none text-muted-foreground">roman.lefarov@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setUserSettingsOpen(true)}>
              <Palette className="mr-2 h-4 w-4" />
              <span>Персонализация</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUserSettingsOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Настройки</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Администрирование</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Справка</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              logout();
              navigate('/');
            }}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Выйти</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <UserSettingsDialog open={userSettingsOpen} onOpenChange={setUserSettingsOpen} />
    </header>
  );
}
