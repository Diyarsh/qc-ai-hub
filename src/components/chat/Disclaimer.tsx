import React from "react";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Disclaimer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-2">
      <AlertTriangle className="h-3 w-3 shrink-0 text-muted-foreground" />
      <p className="leading-relaxed">{t('disclaimer.text')}</p>
    </div>
  );
};

