import { X, CheckCircle2, AlertCircle, XCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface FeedbackPopupProps {
  messageId: string;
  feedback?: 'correct' | 'partially-correct' | 'incorrect';
  feedbackDetails?: string;
  onFeedbackChange: (value: 'correct' | 'partially-correct' | 'incorrect' | null, reasons?: string[], details?: string) => void;
  onClose: () => void;
}

export function FeedbackPopup({ messageId, feedback, feedbackDetails, onFeedbackChange, onClose }: FeedbackPopupProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<'correct' | 'partially-correct' | 'incorrect' | null>(feedback ?? null);
  const [comment, setComment] = useState(feedbackDetails ?? "");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (feedback) {
      setSelectedFeedback(feedback);
      setComment(feedbackDetails ?? "");
    }
  }, [feedback, feedbackDetails]);

  const handleFeedbackClick = (value: 'correct' | 'partially-correct' | 'incorrect') => {
    setSelectedFeedback(value);
    if (value === 'correct') {
      onFeedbackChange(value, [], "");
      setComment("");
      setSubmitted(true);
    } else {
      onFeedbackChange(value, [], comment.trim());
      setSubmitted(false);
    }
  };

  const handleCommentChange = (newComment: string) => {
    setComment(newComment);
    if (selectedFeedback && (selectedFeedback === 'partially-correct' || selectedFeedback === 'incorrect')) {
      onFeedbackChange(selectedFeedback, [], newComment);
    }
  };

  const completeFeedback = () => {
    if (selectedFeedback) {
      onFeedbackChange(selectedFeedback, [], comment.trim());
      setSubmitted(true);
    }
  };

  const handleSave = () => {
    completeFeedback();
  };

  const handleSkip = () => {
    // Пропустить = сохранить оценку без обязательного комментария и показать, что отзыв отправлен
    completeFeedback();
  };

  const needsComment = selectedFeedback === 'partially-correct' || selectedFeedback === 'incorrect';
  const showSuccess = submitted;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 z-50 w-full space-y-3">
      {/* Верхняя строка: вопрос + кнопки + закрыть */}
      <div className="bg-muted/80 hover:bg-muted/90 border border-border/50 rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between gap-4 w-full transition-colors">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Устраивает ли вас ответ?</span>
        <div className="flex items-center gap-2">
          <button
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border shadow-sm",
              selectedFeedback === 'correct'
                ? "bg-green-100/60 dark:bg-green-900/30 border-green-300 dark:border-green-600 text-green-700 dark:text-green-300"
                : "bg-muted/80 border-border/50 text-foreground/70 hover:bg-muted hover:text-foreground hover:border-border hover:shadow-sm"
            )}
            onClick={() => handleFeedbackClick('correct')}
          >
            <CheckCircle2 size={14} />
            <span>Верно</span>
          </button>
          <button
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border shadow-sm",
              selectedFeedback === 'partially-correct'
                ? "bg-yellow-100/60 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300"
                : "bg-muted/80 border-border/50 text-foreground/70 hover:bg-muted hover:text-foreground hover:border-border hover:shadow-sm"
            )}
            onClick={() => handleFeedbackClick('partially-correct')}
          >
            <AlertCircle size={14} />
            <span>Частично</span>
          </button>
          <button
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border shadow-sm",
              selectedFeedback === 'incorrect'
                ? "bg-red-100/60 dark:bg-red-900/30 border-red-300 dark:border-red-600 text-red-700 dark:text-red-300"
                : "bg-muted/80 border-border/50 text-foreground/70 hover:bg-muted hover:text-foreground hover:border-border hover:shadow-sm"
            )}
            onClick={() => handleFeedbackClick('incorrect')}
          >
            <XCircle size={14} />
            <span>Неверно</span>
          </button>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center hover:bg-background/50 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Закрыть"
        >
          <X size={14} />
        </button>
      </div>

      {/* Блок отзыва: текст + поле комментария + Сохранить / Пропустить */}
      {needsComment && !showSuccess && (
        <div className="bg-muted/80 border border-border/50 rounded-2xl px-4 py-3 shadow-sm space-y-2">
          <label className="text-xs font-medium text-muted-foreground block">
            {selectedFeedback === 'partially-correct' ? 'Почему ответ частично верен?' : 'Почему ответ неверен?'}
          </label>
          <Textarea
            value={comment}
            onChange={(e) => handleCommentChange(e.target.value)}
            placeholder={selectedFeedback === 'partially-correct'
              ? 'Опишите, что неверно или что можно улучшить...'
              : 'Опишите, что неверно в ответе...'}
            rows={3}
            className="text-sm focus-visible:ring-0 focus-visible:ring-offset-0 resize-none bg-background/50"
            maxLength={500}
            onFocus={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">{comment.length}/500</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSkip}
                className="text-xs font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md hover:bg-background/50 transition-colors"
              >
                Пропустить
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-md transition-colors"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Сообщение об успешной отправке */}
      {showSuccess && (
        <div className="bg-green-500/10 dark:bg-green-900/20 border border-green-500/30 dark:border-green-700/50 rounded-lg px-3 py-2 shadow-sm flex items-center gap-2">
          <Check size={14} className="text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-xs font-medium text-green-800 dark:text-green-200">
            Спасибо! Ваш отзыв сохранён.
          </p>
        </div>
      )}
    </div>
  );
}
