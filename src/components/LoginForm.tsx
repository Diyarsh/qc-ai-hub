import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LoginFormProps {
  onClose: () => void;
  onLogin: () => void;
}

export const LoginForm = ({ onClose, onLogin }: LoginFormProps) => {
  const { t } = useLanguage();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for admin credentials
    if (loginEmail === "admin" && loginPassword === "admin") {
      onLogin();
      onClose();
    } else {
      alert("Неверные учетные данные. Используйте admin/admin");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerPassword !== registerConfirmPassword) {
      alert("Пароли не совпадают");
      return;
    }
    
    if (registerPassword.length < 6) {
      alert("Пароль должен содержать минимум 6 символов");
      return;
    }
    
    // Simulate successful registration
    alert("Регистрация успешна! Теперь войдите с admin/admin");
    setLoginEmail("admin");
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-card">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold text-center">
            {t('auth.title')}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {t('auth.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">{t('auth.loginTab')}</TabsTrigger>
              <TabsTrigger value="register">{t('auth.registerTab')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{t('auth.username')}</Label>
                  <Input
                    id="login-email"
                    type="text"
                    placeholder={t('auth.loginPlaceholder')}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="bg-muted border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">{t('auth.password')}</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="bg-muted border-border"
                  />
                </div>
                <Button type="submit" variant="hero" className="w-full">
                  {t('auth.loginButton')}
                </Button>
                <div className="text-center">
                  <Button type="button" variant="link" className="text-primary">
                    {t('auth.forgotPassword')}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <div className="mb-4 text-sm text-muted-foreground">
                {t('auth.requiredFields')}
              </div>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">
                    {t('auth.username')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="register-username"
                    type="text"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    required
                    className="bg-muted border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">
                    {t('auth.password')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    className="bg-muted border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">
                    {t('auth.confirmPassword')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    required
                    className="bg-muted border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">
                    {t('auth.email')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className="bg-muted border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-first-name">
                    {t('auth.firstName')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="register-first-name"
                    type="text"
                    value={registerFirstName}
                    onChange={(e) => setRegisterFirstName(e.target.value)}
                    required
                    className="bg-muted border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-last-name">
                    {t('auth.lastName')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="register-last-name"
                    type="text"
                    value={registerLastName}
                    onChange={(e) => setRegisterLastName(e.target.value)}
                    required
                    className="bg-muted border-border"
                  />
                </div>
                <Button type="submit" variant="hero" className="w-full">
                  {t('auth.registerButton')}
                </Button>
                <div className="text-center">
                  <Button 
                    type="button" 
                    variant="link" 
                    className="text-primary"
                    onClick={() => {
                      const loginTab = document.querySelector('[value="login"]') as HTMLElement;
                      loginTab?.click();
                    }}
                  >
                    {t('auth.backToLogin')}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};