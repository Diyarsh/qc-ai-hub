import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { SplineScene } from "@/components/ui/splite";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroSectionProps {
  onLoginClick: () => void;
}
export const HeroSection = ({
  onLoginClick
}: HeroSectionProps) => {
  const { t } = useLanguage();
  
  return <section className="relative min-h-screen flex items-center justify-center bg-background py-12 overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <Card className="w-full min-h-[600px] bg-gradient-to-br from-card via-card to-card/80 relative overflow-hidden border-border/50 shadow-2xl backdrop-blur-sm">
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="hsl(var(--primary))" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
            {/* Left content */}
            <div className="flex-1 p-8 lg:p-12 xl:p-16 relative z-10 flex flex-col justify-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full w-fit border border-primary/20">
                <Sparkles className="w-4 h-4" />
                {t('hero.subtitle')}
              </div>
              
              {/* Title with gradient */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                  AI-HUB
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8 leading-relaxed">
                {t('hero.description')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={onLoginClick}
                  className="group relative overflow-hidden shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center">
                    {t('hero.cta')} 
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
                <Button 
                  variant="outline-hero" 
                  size="lg"
                  className="hover:bg-primary/5 transition-all duration-300"
                >
                  {t('hero.learn-more')}
                </Button>
              </div>
              
            </div>

            {/* Right content - 3D Scene */}
            <div className="flex-1 relative min-h-[400px] lg:min-h-[600px]">
              <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="w-full h-full" />
            </div>
          </div>
        </Card>
      </div>
    </section>;
};