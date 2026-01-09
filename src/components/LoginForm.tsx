import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/shared/components/Toast";
import { InlineError } from "@/components/alerts/InlineError";

interface LoginFormProps {
  onClose: () => void;
  onLogin: () => void;
}

export const LoginForm = ({ onClose, onLogin }: LoginFormProps) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmailOrUsername, setResetEmailOrUsername] = useState("");
  
  // Error states for inline validation
  const [registerPasswordError, setRegisterPasswordError] = useState("");
  const [registerConfirmPasswordError, setRegisterConfirmPasswordError] = useState("");
  const [resetPasswordError, setResetPasswordError] = useState("");

  // Block body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for admin credentials
    if (loginEmail === "admin" && loginPassword === "admin") {
      onLogin();
      onClose();
    } else {
      showToast("Неверные учетные данные. Используйте admin/admin", "error");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setRegisterPasswordError("");
    setRegisterConfirmPasswordError("");
    
    let hasError = false;
    
    if (registerPassword.length < 6) {
      setRegisterPasswordError("Пароль должен содержать минимум 6 символов");
      hasError = true;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      setRegisterConfirmPasswordError("Пароли не совпадают");
      hasError = true;
    }
    
    if (hasError) {
      return;
    }
    
    // Simulate successful registration
    showToast("Регистрация успешна! Теперь войдите с admin/admin", "success");
    setLoginEmail("admin");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    setResetPasswordError("");
    
    if (!resetEmailOrUsername.trim()) {
      setResetPasswordError("Пожалуйста, введите email или имя пользователя");
      return;
    }
    
    // Simulate password reset
    showToast(`Инструкции по восстановлению пароля отправлены на ${resetEmailOrUsername}`, "success");
    setShowResetPassword(false);
    setResetEmailOrUsername("");
    setResetPasswordError("");
  };

  if (showResetPassword) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-card border-border shadow-card my-8">
            <CardHeader className="sticky top-0 bg-card z-10 border-b pb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowResetPassword(false);
                  setResetEmailOrUsername("");
                }}
                className="absolute right-2 top-2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
              <CardTitle className="text-xl sm:text-2xl font-bold text-center pr-8">
                {t('auth.resetPassword.title')}
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground text-sm mt-1">
                {t('auth.resetPassword.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email-username">{t('auth.resetPassword.emailOrUsername')}</Label>
                  <Input
                    id="reset-email-username"
                    type="text"
                    value={resetEmailOrUsername}
                    onChange={(e) => {
                      setResetEmailOrUsername(e.target.value);
                      if (resetPasswordError) setResetPasswordError("");
                    }}
                    placeholder={t('auth.resetPassword.emailOrUsername')}
                    required
                    className={`bg-muted border-border ${resetPasswordError ? "border-destructive" : ""}`}
                  />
                  {resetPasswordError && <InlineError message={resetPasswordError} />}
                </div>
                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setShowResetPassword(false);
                      setResetEmailOrUsername("");
                    }}
                  >
                    {t('auth.resetPassword.goBack')}
                  </Button>
                  <Button type="submit" variant="hero" className="flex-1">
                    {t('auth.resetPassword.submit')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border shadow-card my-8">
          <CardHeader className="sticky top-0 bg-card z-10 border-b pb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-2 top-2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
            <CardTitle className="text-xl sm:text-2xl font-bold text-center pr-8">
              {t('auth.title')}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground text-sm mt-1">
              {t('auth.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="text-sm sm:text-base">{t('auth.loginTab')}</TabsTrigger>
                <TabsTrigger value="register" className="text-sm sm:text-base">{t('auth.registerTab')}</TabsTrigger>
              </TabsList>
            
            <TabsContent value="login" className="mt-0">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm">{t('auth.username')}</Label>
                  <Input
                    id="login-email"
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="bg-muted border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm">{t('auth.password')}</Label>
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
                  <Button 
                    type="button" 
                    variant="link" 
                    className="text-primary text-sm"
                    onClick={() => setShowResetPassword(true)}
                  >
                    {t('auth.forgotPassword')}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="mt-0">
              <div className="mb-4 text-xs sm:text-sm text-muted-foreground">
                {t('auth.requiredFields')}
              </div>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username" className="text-sm">
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
                  <Label htmlFor="register-password" className="text-sm">
                    {t('auth.password')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => {
                      setRegisterPassword(e.target.value);
                      if (registerPasswordError) setRegisterPasswordError("");
                    }}
                    required
                    className={`bg-muted border-border ${registerPasswordError ? "border-destructive" : ""}`}
                  />
                  {registerPasswordError && <InlineError message={registerPasswordError} />}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password" className="text-sm">
                    {t('auth.confirmPassword')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    value={registerConfirmPassword}
                    onChange={(e) => {
                      setRegisterConfirmPassword(e.target.value);
                      if (registerConfirmPasswordError) setRegisterConfirmPasswordError("");
                    }}
                    required
                    className={`bg-muted border-border ${registerConfirmPasswordError ? "border-destructive" : ""}`}
                  />
                  {registerConfirmPasswordError && <InlineError message={registerConfirmPasswordError} />}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-sm">
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
                  <Label htmlFor="register-first-name" className="text-sm">
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
                  <Label htmlFor="register-last-name" className="text-sm">
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
                    className="text-primary text-sm"
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
    </div>
  );
};