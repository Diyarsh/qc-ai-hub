import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import logoDark from "@/assets/QC-AI-HUB-Dark.svg";
import logoLight from "@/assets/QC-AI-HUB-Light.svg";

interface NavigationProps {
  onLoginClick: () => void;
}

export const Navigation = ({ onLoginClick }: NavigationProps) => {
  const { theme } = useTheme();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <img 
          src={theme === "dark" ? logoLight : logoDark} 
          alt="QazCloud AI-HUB" 
          className="h-8"
        />
        <Button onClick={onLoginClick}>
          Войти
        </Button>
      </div>
    </nav>
  );
};