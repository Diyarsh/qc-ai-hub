import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Sun, Moon, Code } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDeveloperMode } from "@/contexts/DeveloperModeContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Switch } from "@/components/ui/switch";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  showDevMode?: boolean;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, showDevMode = true, actions }: PageHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { isDeveloperMode, toggleDeveloperMode } = useDeveloperMode();

  return (
    <header className="flex items-center justify-between bg-background px-6 py-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-9 w-9" />
        {(title || subtitle) && (
          <div>
            {title && <h1 className="text-2xl font-bold">{title}</h1>}
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <LanguageSelector />
        
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {showDevMode && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Dev Mode</span>
            <Switch checked={isDeveloperMode} onCheckedChange={toggleDeveloperMode} />
          </div>
        )}
      </div>
    </header>
  );
}
