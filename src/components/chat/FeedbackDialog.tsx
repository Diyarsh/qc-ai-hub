import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reasons: string[], details: string) => void;
  feedbackType?: 'partially-correct' | 'incorrect' | null;
  triggerRef?: React.RefObject<HTMLButtonElement>;
}

export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  feedbackType,
  triggerRef,
}) => {
  const { t } = useLanguage();
  const [details, setDetails] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleClose = () => {
    setDetails("");
    onClose();
  };

  const handleSubmit = () => {
    onSubmit([], details);
    setDetails("");
    onClose();
  };

  useEffect(() => {
    if (isOpen && triggerRef?.current) {
      const trigger = triggerRef.current;
      const rect = trigger.getBoundingClientRect();
      const popoverWidth = 320; // w-80 = 320px
      const popoverHeight = 200; // примерная высота
      
      // Позиционирование снизу от кнопки
      let top = rect.bottom + 8;
      let left = rect.left;
      
      // Проверка, не выходит ли за правый край экрана
      if (left + popoverWidth > window.innerWidth) {
        left = window.innerWidth - popoverWidth - 16;
      }
      
      // Проверка, не выходит ли за нижний край экрана
      if (top + popoverHeight > window.innerHeight) {
        // Показываем сверху от кнопки
        top = rect.top - popoverHeight - 8;
      }
      
      // Проверка, не выходит ли за левый край
      if (left < 16) {
        left = 16;
      }
      
      setPosition({
        top,
        left,
      });
    }
  }, [isOpen, triggerRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef?.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  const getTitle = () => {
    if (feedbackType === 'partially-correct') {
      return 'Частично верно';
    } else if (feedbackType === 'incorrect') {
      return 'Неверно';
    }
    return 'Поделиться отзывом';
  };

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 w-80 rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">{getTitle()}</h3>
        <button
          onClick={handleClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <Textarea
        placeholder="Поделитесь подробностями (необязательно)"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        className="min-h-[100px] text-sm resize-none mb-3"
        autoFocus
      />

      <p className="text-xs text-muted-foreground mb-3">
        Ваш отзыв поможет улучшить качество ответов платформы.
      </p>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={handleClose}
          size="sm"
        >
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          size="sm"
        >
          Отправить
        </Button>
      </div>
    </div>
  );
};

