import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Lock } from "lucide-react";

export const AdvantagesSection = () => {
  const advantages = [
    {
      icon: Shield,
      title: "Цифровой суверенитет",
      description: "Технологическая независимость и контроль над ИИ-решениями"
    },
    {
      icon: Zap,
      title: "Масштабируемость",
      description: "От прототипа до промышленного внедрения без ограничений"
    },
    {
      icon: Lock,
      title: "Безопасность",
      description: "Национальный ИТ-контур с высоким уровнем защиты данных"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Ключевые преимущества</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Современные технологии ИИ с полным контролем и безопасностью
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <Card key={index} className="bg-card border-border shadow-card hover:shadow-glow transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                  <advantage.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold">{advantage.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground">
                  {advantage.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};