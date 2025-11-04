import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Sun, Moon, Code } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { DevModeToggle } from "@/components/DevModeToggle";
import { useEffect, useState } from "react";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
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
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-background px-4 sm:px-6 py-4 min-h-[68px] relative z-10">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <SidebarTrigger className="h-9 w-9 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          {title && <h1 className="text-xl sm:text-2xl font-bold leading-tight truncate">{title}</h1>}
          {/* Reserve space for subtitle to avoid layout jump */}
          {subtitle ? (
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{subtitle}</p>
          ) : (
            <p className="text-xs sm:text-sm opacity-0 select-none">&nbsp;</p>
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
      </div>
    </header>
  );
}
