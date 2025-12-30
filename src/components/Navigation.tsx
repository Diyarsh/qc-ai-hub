import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import logoDark from "@/assets/QC_Black_icon.svg";
import logoLight from "@/assets/QC_White_icon.svg";
import { useEffect, useState } from "react";

interface NavigationProps {
  onLoginClick: () => void;
}

export const Navigation = ({ onLoginClick }: NavigationProps) => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
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
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <img 
          src={currentTheme === "dark" ? logoLight : logoDark} 
          alt="QazCloud AI-HUB" 
          className="h-10"
          style={{ transform: 'rotate(-90deg)' }}
        />
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
          >
            {currentTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button onClick={onLoginClick}>
            {t('nav.login')}
          </Button>
        </div>
      </div>
    </nav>
  );
};