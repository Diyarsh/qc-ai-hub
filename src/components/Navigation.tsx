import { Button } from "@/components/ui/button";

interface NavigationProps {
  onLoginClick: () => void;
}

export const Navigation = ({ onLoginClick }: NavigationProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold bg-gradient-cyan bg-clip-text text-transparent">
            QazCloud AI-HUB
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            О платформе
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Документация
          </Button>
          <Button variant="outline-hero" onClick={onLoginClick}>
            Войти
          </Button>
        </div>
      </div>
    </nav>
  );
};