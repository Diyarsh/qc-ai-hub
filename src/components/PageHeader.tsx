import { Button } from "@/components/ui/button";
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
    <header className="sticky top-0 flex flex-col sm:flex-row items-center justify-between gap-4 bg-background/95 backdrop-blur-sm border-b px-4 sm:px-6 py-4 h-[68px] z-50">
      <div className="flex items-center gap-3 w-full sm:w-auto min-h-[36px]">
        <div className="min-w-0 flex-1 flex flex-col justify-center">
          {title ? (
            <h1 className="text-xl sm:text-2xl font-bold leading-tight truncate">{title}</h1>
          ) : (
            <span className="text-xl sm:text-2xl font-bold tracking-tight">AI-HUB</span>
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
      </div>
    </header>
  );
}
