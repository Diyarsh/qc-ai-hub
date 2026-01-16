import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { EvaluationService } from "@/services/evaluation.service";
import { MessageEvaluation, EvaluationRating, EvaluationOption } from "@/types/message-evaluation";
import { cn } from "@/lib/utils";

const evaluationOptions: EvaluationOption[] = [
  { value: 1, label: "Верно", icon: "✓", color: "bg-green-500 hover:bg-green-600 border-green-500" },
  { value: 2, label: "Частично верно", icon: "~", color: "bg-yellow-500 hover:bg-yellow-600 border-yellow-500" },
  { value: 3, label: "Неверно", icon: "✗", color: "bg-red-500 hover:bg-red-600 border-red-500" },
];

interface MessageEvaluationProps {
  messageId: string;
  onEvaluationChange?: (evaluation: MessageEvaluation | null) => void;
  compact?: boolean;
}

export const MessageEvaluationComponent: React.FC<MessageEvaluationProps> = ({
  messageId,
  onEvaluationChange,
  compact = false,
}) => {
  const [evaluation, setEvaluation] = useState<MessageEvaluation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempRating, setTempRating] = useState<EvaluationRating | null>(null);

  useEffect(() => {
    const existing = EvaluationService.getEvaluation(messageId);
    setEvaluation(existing);
    if (existing) {
      setTempRating(existing.rating);
    } else {
      setTempRating(null);
    }
  }, [messageId]);

  const handleRatingClick = (rating: EvaluationRating) => {
    if (evaluation && evaluation.rating === rating) {
      // Если кликнули на уже выбранную оценку, открываем диалог для удаления
      setIsDialogOpen(true);
      setTempRating(rating);
    } else {
      // Сохраняем оценку сразу
      const newEvaluation = EvaluationService.saveEvaluation(messageId, rating);
      setEvaluation(newEvaluation);
      onEvaluationChange?.(newEvaluation);
    }
  };

  const handleSave = () => {
    if (tempRating) {
      const newEvaluation = EvaluationService.saveEvaluation(messageId, tempRating);
      setEvaluation(newEvaluation);
      setIsDialogOpen(false);
      onEvaluationChange?.(newEvaluation);
    }
  };

  const handleDelete = () => {
    EvaluationService.deleteEvaluation(messageId);
    setEvaluation(null);
    setTempRating(null);
    setIsDialogOpen(false);
    onEvaluationChange?.(null);
  };

  const handleOpenDialog = () => {
    if (evaluation) {
      setTempRating(evaluation.rating);
    }
    setIsDialogOpen(true);
  };

  if (compact) {
    const selectedOption = evaluation ? evaluationOptions.find(opt => opt.value === evaluation.rating) : null;
    
    return (
      <>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {evaluationOptions.map((option) => {
            const isSelected = evaluation?.rating === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleRatingClick(option.value)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all",
                  "border hover:scale-105",
                  isSelected
                    ? cn(
                        "border-2 font-medium",
                        option.value === 1 && "bg-green-500/10 border-green-500 text-green-700 dark:text-green-400",
                        option.value === 2 && "bg-yellow-500/10 border-yellow-500 text-yellow-700 dark:text-yellow-400",
                        option.value === 3 && "bg-red-500/10 border-red-500 text-red-700 dark:text-red-400"
                      )
                    : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                title={option.label}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Оценить ответ</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-3">
                {evaluationOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTempRating(option.value)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      tempRating === option.value
                        ? cn(
                            "border-primary scale-105",
                            option.value === 1 && "border-green-500 bg-green-500/10",
                            option.value === 2 && "border-yellow-500 bg-yellow-500/10",
                            option.value === 3 && "border-red-500 bg-red-500/10"
                          )
                        : "border-border hover:border-primary/50 hover:bg-accent"
                    )}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span className={cn(
                      "text-sm font-medium",
                      tempRating === option.value && "text-primary"
                    )}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Отмена
              </Button>
              {evaluation && (
                <Button variant="destructive" onClick={handleDelete}>
                  Удалить
                </Button>
              )}
              <Button onClick={handleSave} disabled={!tempRating}>
                Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50 flex-wrap">
        <span className="text-xs text-muted-foreground">Оценка:</span>
        {evaluationOptions.map((option) => {
          const isSelected = evaluation?.rating === option.value;
          return (
            <button
              key={option.value}
              onClick={() => handleRatingClick(option.value)}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all",
                "border hover:scale-105",
                isSelected
                  ? cn(
                      "border-2 font-medium",
                      option.value === 1 && "bg-green-500/10 border-green-500 text-green-700 dark:text-green-400",
                      option.value === 2 && "bg-yellow-500/10 border-yellow-500 text-yellow-700 dark:text-yellow-400",
                      option.value === 3 && "bg-red-500/10 border-red-500 text-red-700 dark:text-red-400"
                    )
                  : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Оценить ответ модели</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-3">
              {evaluationOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTempRating(option.value)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    tempRating === option.value
                      ? cn(
                          "border-primary scale-105",
                          option.value === 1 && "border-green-500 bg-green-500/10",
                          option.value === 2 && "border-yellow-500 bg-yellow-500/10",
                          option.value === 3 && "border-red-500 bg-red-500/10"
                        )
                      : "border-border hover:border-primary/50 hover:bg-accent"
                  )}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className={cn(
                    "text-sm font-medium",
                    tempRating === option.value && "text-primary"
                  )}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
            {evaluation && (
              <Button variant="destructive" onClick={handleDelete}>
                Удалить
              </Button>
            )}
            <Button onClick={handleSave} disabled={!tempRating}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};






