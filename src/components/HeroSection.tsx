import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onLoginClick: () => void;
}

export const HeroSection = ({ onLoginClick }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-6 animate-float">
            Централизованная платформа ИИ для цифрового суверенитета
          </p>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-cyan bg-clip-text text-transparent">
              QazCloud AI-HUB
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Единая точка доступа к возможностям искусственного интеллекта. 
            От идеи до промышленного внедрения с технологическим суверенитетом.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8 py-4"
              onClick={onLoginClick}
            >
              AI-HUB <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline-hero" 
              size="lg" 
              className="text-lg px-8 py-4"
            >
              Узнать больше
            </Button>
          </div>
        </div>
      </div>
      
      {/* Animated elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-float opacity-70"></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-primary-glow rounded-full animate-float opacity-60" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-primary rounded-full animate-float opacity-50" style={{ animationDelay: '4s' }}></div>
    </section>
  );
};