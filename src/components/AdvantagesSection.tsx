import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// 3D Icon wrapper component with gradient and glow effects
const Icon3D = ({ 
  children, 
  gradient 
}: { 
  children: React.ReactNode; 
  gradient: string;
}) => (
  <div className="relative group-hover:scale-110 transition-transform duration-500">
    {/* Glow effect */}
    <div className={`absolute inset-0 rounded-2xl ${gradient} opacity-40 blur-xl group-hover:opacity-60 transition-opacity duration-500`} />
    {/* Main icon container */}
    <div className={`relative p-5 rounded-2xl ${gradient} shadow-lg transform group-hover:-translate-y-1 transition-all duration-500`}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent" />
      {children}
    </div>
  </div>
);

export const AdvantagesSection = () => {
  const { t } = useLanguage();
  const advantages = [
    {
      icon: Shield,
      title: t('advantages.sovereignty.title'),
      description: t('advantages.sovereignty.description'),
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
      iconColor: "text-white",
      accentColor: "from-blue-500/20 to-blue-600/5"
    },
    {
      icon: Zap,
      title: t('advantages.scalability.title'),
      description: t('advantages.scalability.description'),
      gradient: "bg-gradient-to-br from-amber-400 to-orange-600",
      iconColor: "text-white",
      accentColor: "from-amber-500/20 to-orange-600/5"
    },
    {
      icon: Lock,
      title: t('advantages.security.title'),
      description: t('advantages.security.description'),
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-700",
      iconColor: "text-white",
      accentColor: "from-emerald-500/20 to-teal-600/5"
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
            Преимущества
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t('advantages.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('advantages.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <Card 
              key={index} 
              className="relative bg-card/80 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${advantage.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <CardHeader className="text-center relative z-10 pt-8">
                <div className="mx-auto mb-6">
                  <Icon3D gradient={advantage.gradient}>
                    <advantage.icon className={`h-8 w-8 ${advantage.iconColor} relative z-10`} strokeWidth={1.5} />
                  </Icon3D>
                </div>
                <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                  {advantage.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pb-8">
                <CardDescription className="text-center text-muted-foreground leading-relaxed">
                  {advantage.description}
                </CardDescription>
              </CardContent>
              
              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${advantage.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};