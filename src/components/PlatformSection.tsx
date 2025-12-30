import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Database, Shield, Layers } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Floating 3D icon with multi-layer effect
const FloatingIcon3D = ({ 
  children, 
  gradient,
  delay = 0
}: { 
  children: React.ReactNode; 
  gradient: string;
  delay?: number;
}) => (
  <div 
    className="relative transform group-hover:-translate-y-2 transition-transform duration-700"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Shadow layer */}
    <div className={`absolute inset-0 rounded-3xl ${gradient} opacity-30 blur-2xl translate-y-4 scale-90`} />
    {/* Back layer */}
    <div className={`absolute inset-0 rounded-3xl ${gradient} opacity-20 translate-y-2 translate-x-1`} />
    {/* Main icon */}
    <div className={`relative p-6 rounded-3xl ${gradient} shadow-2xl`}>
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 via-white/10 to-transparent" />
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 to-transparent" />
      {children}
    </div>
  </div>
);

export const PlatformSection = () => {
  const { t } = useLanguage();
  const features = [
    {
      icon: Server,
      title: t('platform.compute.title'),
      description: t('platform.compute.description'),
      gradient: "bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600",
      number: "01"
    },
    {
      icon: Database,
      title: t('platform.data.title'),
      description: t('platform.data.description'),
      gradient: "bg-gradient-to-br from-indigo-400 via-blue-500 to-indigo-600",
      number: "02"
    },
    {
      icon: Shield,
      title: t('platform.infrastructure.title'),
      description: t('platform.infrastructure.description'),
      gradient: "bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600",
      number: "03"
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
            <Layers className="w-4 h-4" />
            Платформа
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('platform.title')}</h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {t('platform.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="relative group"
            >
              {/* Number badge */}
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-card border border-border shadow-lg flex items-center justify-center z-20">
                <span className="text-sm font-bold text-muted-foreground">{feature.number}</span>
              </div>
              
              <Card className="relative bg-card/80 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 text-center overflow-hidden h-full">
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader className="relative z-10 pt-10">
                  <div className="mx-auto mb-6">
                    <FloatingIcon3D gradient={feature.gradient} delay={index * 100}>
                      <feature.icon className="h-10 w-10 text-white relative z-10" strokeWidth={1.5} />
                    </FloatingIcon3D>
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 pb-8">
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                
                {/* Decorative corner */}
                <div className={`absolute bottom-0 right-0 w-24 h-24 ${feature.gradient} opacity-10 rounded-tl-full`} />
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};