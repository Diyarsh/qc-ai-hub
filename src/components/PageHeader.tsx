import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Sun, Moon, Code } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-background px-4 sm:px-6 py-4 min-h-[68px]">
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
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end flex-nowrap">
        {actions}
        <LanguageSelector />
        
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
