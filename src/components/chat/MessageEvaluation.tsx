import React, { useState, useEffect } from "react";
import { Star, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { EvaluationService } from "@/services/evaluation.service";
import { MessageEvaluation, EvaluationRating } from "@/types/message-evaluation";
import { cn } from "@/lib/utils";

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
  const [tempComment, setTempComment] = useState("");

  useEffect(() => {
    const existing = EvaluationService.getEvaluation(messageId);
    setEvaluation(existing);
    if (existing) {
      setTempRating(existing.rating);
      setTempComment(existing.comment || "");
    }
  }, [messageId]);

  const handleStarClick = (rating: EvaluationRating) => {
    setTempRating(rating);
    if (!isDialogOpen) {
      setIsDialogOpen(true);
    }
  };

  const handleSave = () => {
    if (tempRating) {
      const newEvaluation = EvaluationService.saveEvaluation(
        messageId,
        tempRating,
        tempComment || undefined
      );
      setEvaluation(newEvaluation);
      setIsDialogOpen(false);
      onEvaluationChange?.(newEvaluation);
    }
  };

  const handleDelete = () => {
    EvaluationService.deleteEvaluation(messageId);
    setEvaluation(null);
    setTempRating(null);
    setTempComment("");
    setIsDialogOpen(false);
    onEvaluationChange?.(null);
  };

  const handleOpenDialog = () => {
    if (evaluation) {
      setTempRating(evaluation.rating);
      setTempComment(evaluation.comment || "");
    }
    setIsDialogOpen(true);
  };

  if (compact) {
    return (
      <>
        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleStarClick(star as EvaluationRating)}
              className={cn(
                "transition-colors hover:scale-110",
                evaluation && evaluation.rating >= star
                  ? "text-yellow-500"
                  : "text-muted-foreground hover:text-yellow-400"
              )}
            >
              <Star
                size={14}
                className={cn(
                  evaluation && evaluation.rating >= star ? "fill-current" : ""
                )}
              />
            </button>
          ))}
          {evaluation?.comment && (
            <button
              onClick={handleOpenDialog}
              className="ml-2 text-muted-foreground hover:text-primary"
              title="Показать комментарий"
            >
              <MessageSquare size={14} />
            </button>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Оценить ответ</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setTempRating(star as EvaluationRating)}
                    className={cn(
                      "transition-all hover:scale-125",
                      tempRating && tempRating >= star
                        ? "text-yellow-500"
                        : "text-muted-foreground hover:text-yellow-400"
                    )}
                  >
                    <Star
                      size={32}
                      className={cn(
                        tempRating && tempRating >= star ? "fill-current" : ""
                      )}
                    />
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Комментарий (необязательно)</label>
                <Textarea
                  value={tempComment}
                  onChange={(e) => setTempComment(e.target.value)}
                  placeholder="Добавьте комментарий к оценке..."
                  rows={4}
                />
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
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
        <span className="text-xs text-muted-foreground">Оценка:</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleStarClick(star as EvaluationRating)}
              className={cn(
                "transition-colors hover:scale-110",
                evaluation && evaluation.rating >= star
                  ? "text-yellow-500"
                  : "text-muted-foreground hover:text-yellow-400"
              )}
            >
              <Star
                size={16}
                className={cn(
                  evaluation && evaluation.rating >= star ? "fill-current" : ""
                )}
              />
            </button>
          ))}
        </div>
        {evaluation?.comment && (
          <button
            onClick={handleOpenDialog}
            className="ml-2 text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            <MessageSquare size={14} />
            Комментарий
          </button>
        )}
        {!evaluation && (
          <button
            onClick={handleOpenDialog}
            className="ml-2 text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            <MessageSquare size={14} />
            Добавить комментарий
          </button>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Оценить ответ модели</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setTempRating(star as EvaluationRating)}
                  className={cn(
                    "transition-all hover:scale-125",
                    tempRating && tempRating >= star
                      ? "text-yellow-500"
                      : "text-muted-foreground hover:text-yellow-400"
                  )}
                >
                  <Star
                    size={32}
                    className={cn(
                      tempRating && tempRating >= star ? "fill-current" : ""
                    )}
                  />
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Комментарий (необязательно)</label>
              <Textarea
                value={tempComment}
                onChange={(e) => setTempComment(e.target.value)}
                placeholder="Добавьте комментарий к оценке..."
                rows={4}
              />
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

