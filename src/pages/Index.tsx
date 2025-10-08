import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AdvantagesSection } from "@/components/AdvantagesSection";
import { ServicesSection } from "@/components/ServicesSection";
import { PlatformSection } from "@/components/PlatformSection";
import { LoginForm } from "@/components/LoginForm";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Redirect to dashboard if logged in
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onLoginClick={() => setShowLogin(true)} />
      <HeroSection onLoginClick={() => setShowLogin(true)} />
      <AdvantagesSection />
      <ServicesSection />
      <PlatformSection />
      <Footer />
      
      {showLogin && (
        <LoginForm 
          onClose={() => setShowLogin(false)} 
          onLogin={() => setIsLoggedIn(true)}
        />
      )}
    </div>
  );
};

export default Index;
