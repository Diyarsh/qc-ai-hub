import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AdvantagesSection } from "@/components/AdvantagesSection";
import { ServicesSection } from "@/components/ServicesSection";
import { PlatformSection } from "@/components/PlatformSection";
import { LoginForm } from "@/components/LoginForm";

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation onLoginClick={() => setShowLogin(true)} />
      <HeroSection onLoginClick={() => setShowLogin(true)} />
      <AdvantagesSection />
      <ServicesSection />
      <PlatformSection />
      
      {showLogin && (
        <LoginForm onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
};

export default Index;
