import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { showToast } from "@/shared/components/Toast";
import { cn } from "@/lib/utils";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: 'correct' | 'partially-correct' | 'incorrect', details?: string) => void;
  currentFeedback?: 'correct' | 'partially-correct' | 'incorrect' | null;
}

type Step = 'select' | 'details' | 'confirm';

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentFeedback,
}) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>('select');
  const [selectedType, setSelectedType] = useState<'correct' | 'partially-correct' | 'incorrect' | null>(null);
  const [details, setDetails] = useState("");

  // Сброс состояния при открытии/закрытии модального окна
  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setSelectedType(null);
      setDetails("");
    }
  }, [isOpen]);

  const handleSelectType = (type: 'correct' | 'partially-correct' | 'incorrect') => {
    setSelectedType(type);
    
    if (type === 'correct') {
      // Для "верно" показываем подтверждение и закрываем
      onSubmit(type);
      showToast(t('feedback.correct') + ' - Спасибо за отзыв!', 'info');
      onClose();
    } else {
      // Для "частично верно" и "неверно" переходим на шаг 2
      setStep('details');
    }
  };

  const handleBack = () => {
    setStep('select');
    setSelectedType(null);
    setDetails("");
  };

  const handleSubmit = () => {
    if (selectedType) {
      onSubmit(selectedType, details);
      
      // Показываем подтверждение для всех типов feedback
      const feedbackMessages = {
        'correct': t('feedback.correct'),
        'partially-correct': t('feedback.partiallyCorrect'),
        'incorrect': t('feedback.incorrect'),
      };
      
      showToast(feedbackMessages[selectedType] + ' - Спасибо за отзыв!', 'info');
      onClose();
    }
  };

  const handleClose = () => {
    setStep('select');
    setSelectedType(null);
    setDetails("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[380px] p-4">
        <DialogHeader className={cn("pb-3", step === 'details' && "pb-2.5")}>
          <DialogTitle className="text-base font-medium">
            {step === 'select' ? 'Оцените ответ' : 
             selectedType === 'partially-correct' ? 'Частично верно' : 
             'Неверно'}
          </DialogTitle>
          <DialogDescription className="text-xs mt-1">
            {step === 'select' && 'Выберите, насколько точным был ответ'}
          </DialogDescription>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-2">
            <button
              onClick={() => handleSelectType('correct')}
              className={cn(
                "w-full flex items-center gap-2.5 p-2.5 rounded-lg transition-all text-left",
                "hover:bg-green-500/10 active:scale-[0.98]",
                currentFeedback === 'correct'
                  ? "bg-green-500/15"
                  : ""
              )}
            >
              <CheckCircle 
                size={18} 
                className={cn(
                  "shrink-0 transition-colors",
                  currentFeedback === 'correct'
                    ? "text-green-600 dark:text-green-500"
                    : "text-muted-foreground/60"
                )} 
              />
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "text-sm leading-tight transition-colors",
                  currentFeedback === 'correct'
                    ? "font-medium text-green-600 dark:text-green-500"
                    : "font-medium text-foreground"
                )}>
                  {t('feedback.correct')}
                </div>
                <div className="text-xs text-muted-foreground/70 mt-0.5 leading-tight">Ответ полностью соответствует запросу</div>
              </div>
            </button>

            <button
              onClick={() => handleSelectType('partially-correct')}
              className={cn(
                "w-full flex items-center gap-2.5 p-2.5 rounded-lg transition-all text-left",
                "hover:bg-yellow-500/10 active:scale-[0.98]",
                currentFeedback === 'partially-correct'
                  ? "bg-yellow-500/15"
                  : ""
              )}
            >
              <AlertCircle 
                size={18} 
                className={cn(
                  "shrink-0 transition-colors",
                  currentFeedback === 'partially-correct'
                    ? "text-yellow-600 dark:text-yellow-500"
                    : "text-muted-foreground/60"
                )} 
              />
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "text-sm leading-tight transition-colors",
                  currentFeedback === 'partially-correct'
                    ? "font-medium text-yellow-600 dark:text-yellow-500"
                    : "font-medium text-foreground"
                )}>
                  {t('feedback.partiallyCorrect')}
                </div>
                <div className="text-xs text-muted-foreground/70 mt-0.5 leading-tight">Ответ частично соответствует запросу</div>
              </div>
            </button>

            <button
              onClick={() => handleSelectType('incorrect')}
              className={cn(
                "w-full flex items-center gap-2.5 p-2.5 rounded-lg transition-all text-left",
                "hover:bg-red-500/10 active:scale-[0.98]",
                currentFeedback === 'incorrect'
                  ? "bg-red-500/15"
                  : ""
              )}
            >
              <XCircle 
                size={18} 
                className={cn(
                  "shrink-0 transition-colors",
                  currentFeedback === 'incorrect'
                    ? "text-red-600 dark:text-red-500"
                    : "text-muted-foreground/60"
                )} 
              />
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "text-sm leading-tight transition-colors",
                  currentFeedback === 'incorrect'
                    ? "font-medium text-red-600 dark:text-red-500"
                    : "font-medium text-foreground"
                )}>
                  {t('feedback.incorrect')}
                </div>
                <div className="text-xs text-muted-foreground/70 mt-0.5 leading-tight">Ответ не соответствует запросу</div>
              </div>
            </button>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-2.5">
            <Textarea
              placeholder="Что можно улучшить? (необязательно)"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="min-h-[80px] text-sm resize-none border-border/60 focus:border-primary/50 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={handleBack}
                size="sm"
                className="h-8 px-3 text-xs"
              >
                Назад
              </Button>
              <Button
                onClick={handleSubmit}
                size="sm"
                className="h-8 px-3 text-xs"
              >
                Отправить
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
