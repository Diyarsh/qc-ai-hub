import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Database, Shield } from "lucide-react";

export const PlatformSection = () => {
  const features = [
    {
      icon: Server,
      title: "Мощные вычисления",
      description: "Высокопроизводительные GPU и CPU для обучения и инференса AI-моделей"
    },
    {
      icon: Database,
      title: "Безопасные данные",
      description: "Защищенное хранение и обработка данных в соответствии с требованиями безопасности"
    },
    {
      icon: Shield,
      title: "Надежная инфраструктура",
      description: "Отказоустойчивая архитектура с высоким уровнем доступности сервисов"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">О платформе AI-HUB</h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Современная облачная платформа для разработки, обучения и развертывания 
            решений искусственного интеллекта с полным контролем над данными и процессами
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card border-border shadow-card hover:shadow-glow transition-all duration-300 text-center group">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};