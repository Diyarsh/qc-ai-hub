import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { LoginForm } from "@/components/LoginForm";

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
