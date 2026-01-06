import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reasons: string[], details: string) => void;
}

const feedbackReasons = [
  { id: "business-requirements", label: "Не соответствует бизнес-требованиям" },
  { id: "inaccurate-data", label: "Неточные данные или расчеты" },
  { id: "incomplete-info", label: "Неполная информация" },
  { id: "corporate-standards", label: "Не соответствует корпоративным стандартам" },
  { id: "inefficient", label: "Неэффективные рекомендации" },
  { id: "security", label: "Вопросы безопасности данных" },
  { id: "other", label: "Другое" },
];

export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [details, setDetails] = useState("");

  const toggleReason = (id: string) => {
    setSelectedReasons(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedReasons, details);
    setSelectedReasons([]);
    setDetails("");
    onClose();
  };

  const handleClose = () => {
    setSelectedReasons([]);
    setDetails("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Поделиться отзывом</DialogTitle>
        </DialogHeader>

        {/* Reason chips */}
        <div className="flex flex-wrap gap-2 mt-2">
          {feedbackReasons.map((reason) => (
            <button
              key={reason.id}
              onClick={() => toggleReason(reason.id)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full border transition-all duration-200",
                selectedReasons.includes(reason.id)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:bg-muted hover:border-muted-foreground/30"
              )}
            >
              {reason.label}
            </button>
          ))}
        </div>

        {/* Details textarea */}
        <Textarea
          placeholder="Поделитесь подробностями (необязательно)"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="min-h-[80px] text-sm resize-none mt-4"
        />

        {/* Info text */}
        <p className="text-xs text-muted-foreground mt-2">
          Ваш отзыв поможет улучшить качество ответов платформы.
        </p>

        {/* Submit button */}
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            size="sm"
          >
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedReasons.length === 0 && details.trim().length === 0}
            size="sm"
          >
            Отправить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

