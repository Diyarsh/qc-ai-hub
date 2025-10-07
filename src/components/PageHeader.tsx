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
export function PageHeader({
  title,
  subtitle,
  showDevMode = true,
  actions
}: PageHeaderProps) {
  const {
    theme,
    setTheme
  } = useTheme();
  const {
    isDeveloperMode,
    toggleDeveloperMode
  } = useDeveloperMode();
  return;
}