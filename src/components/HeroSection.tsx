import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { SplineScene } from "@/components/ui/splite";

interface HeroSectionProps {
  onLoginClick: () => void;
}

export const HeroSection = ({ onLoginClick }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-12" style={{ backgroundColor: 'hsl(220, 30%, 4%)' }}>
      <div className="container mx-auto px-4">
        <Card className="w-full min-h-[600px] bg-card relative overflow-hidden border-border">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="hsl(var(--primary))"
          />
          
          <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
            {/* Left content */}
            <div className="flex-1 p-8 lg:p-12 relative z-10 flex flex-col justify-center">
              <p className="text-sm uppercase tracking-wide text-muted-foreground mb-4">
                Централизованная платформа ИИ для цифрового суверенитета
              </p>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                QazCloud AI-HUB
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg mb-8">
                Единая точка доступа к возможностям искусственного интеллекта. 
                От идеи до промышленного внедрения с технологическим суверенитетом.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" onClick={onLoginClick}>
                  AI-HUB <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline-hero" size="lg">
                  Узнать больше
                </Button>
              </div>
            </div>

            {/* Right content - 3D Scene */}
            <div className="flex-1 relative min-h-[400px] lg:min-h-[600px]">
              <SplineScene 
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};