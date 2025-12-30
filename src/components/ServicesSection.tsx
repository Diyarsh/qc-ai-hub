import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Users, Check, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// 3D Icon component with gradient
const ServiceIcon3D = ({ 
  children, 
  gradient,
  glowColor
}: { 
  children: React.ReactNode; 
  gradient: string;
  glowColor: string;
}) => (
  <div className="relative">
    {/* Animated glow */}
    <div className={`absolute inset-0 rounded-2xl ${glowColor} opacity-50 blur-xl animate-pulse`} />
    {/* Icon container */}
    <div className={`relative p-4 rounded-2xl ${gradient} shadow-lg`}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-white/20" />
      {children}
    </div>
  </div>
);

export const ServicesSection = () => {
  const { t } = useLanguage();
  const services = [
    {
      title: t('services.self-service.title'),
      description: t('services.self-service.description'),
      icon: Cpu,
      gradient: "bg-gradient-to-br from-violet-500 via-purple-500 to-purple-700",
      glowColor: "bg-violet-500",
      accentBorder: "border-violet-500/30",
      features: [
        t('services.self-service.feature1'),
        t('services.self-service.feature2'),
        t('services.self-service.feature3')
      ]
    },
    {
      title: t('services.ai-service.title'),
      description: t('services.ai-service.description'),
      icon: Users,
      gradient: "bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700",
      glowColor: "bg-cyan-500",
      accentBorder: "border-cyan-500/30",
      features: [
        t('services.ai-service.feature1'),
        t('services.ai-service.feature2'),
        t('services.ai-service.feature3')
      ]
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
            <Sparkles className="w-4 h-4" />
            Сервисы
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('services.title')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={`relative bg-card/90 backdrop-blur-sm border-2 ${service.accentBorder} shadow-xl hover:shadow-2xl transition-all duration-500 h-full group overflow-hidden`}
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative z-10">
                <div className="flex items-start space-x-5 mb-4">
                  <ServiceIcon3D gradient={service.gradient} glowColor={service.glowColor}>
                    <service.icon className="h-7 w-7 text-white relative z-10" strokeWidth={1.5} />
                  </ServiceIcon3D>
                  <div className="flex-1 pt-1">
                    <CardTitle className="text-2xl font-semibold mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-4">
                  {service.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex} 
                      className="flex items-start space-x-3 group/item"
                    >
                      <div className={`flex-shrink-0 mt-0.5 p-1 rounded-lg ${service.gradient}`}>
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                      <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};