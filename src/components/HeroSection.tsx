import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
interface HeroSectionProps {
  onLoginClick: () => void;
}
export const HeroSection = ({
  onLoginClick
}: HeroSectionProps) => {
  return <section className="relative min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Централизованная платформа ИИ для цифрового суверенитета
          </p>
          
          <h1 className="text-5xl md:text-6xl font-bold text-primary">
            QazCloud AI-HUB
          </h1>
          
          <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto">
            Единая точка доступа к возможностям искусственного интеллекта. 
            От идеи до промышленного внедрения с технологическим суверенитетом.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="hero" size="lg" onClick={onLoginClick}>
              AI-HUB <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline-hero" size="lg">
              Узнать больше
            </Button>
          </div>
        </div>
      </div>
    </section>;
};