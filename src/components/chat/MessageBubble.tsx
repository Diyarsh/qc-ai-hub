import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Edit2, Trash2, Timer, Copy, Check, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/shared/components/Toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  text: string;
  role: 'user' | 'assistant';
  messageId?: string;
  isLoading?: boolean;
  streaming?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  files?: { name: string; url?: string; type?: string }[];
  durationMs?: number;
  feedback?: 'correct' | 'partially-correct' | 'incorrect';
  feedbackDetails?: string;
  onFeedbackChange?: (value: 'correct' | 'partially-correct' | 'incorrect' | null, reasons?: string[], details?: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  role,
  messageId,
  isLoading,
  streaming,
  onEdit,
  onDelete,
  onCopy,
  files = [],
  durationMs,
  feedback,
  feedbackDetails,
  onFeedbackChange,
}) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [comment, setComment] = useState(feedbackDetails || "");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCommentField, setShowCommentField] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedComment = feedbackDetails || "";
    setComment(savedComment);
    // Показываем поле комментария только если есть сохраненный комментарий
    if (savedComment.trim().length > 0) {
      setShowCommentField(true);
    } else {
      // Если комментария нет, скрываем поле
      setShowCommentField(false);
    }
  }, [feedbackDetails]);

  // Reset copied state after 3 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      onCopy?.();
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      onCopy?.();
    });
  };

  const handleFeedbackClick = (value: 'correct' | 'partially-correct' | 'incorrect') => {
    if (feedback === value) {
      // Если кликнули на уже выбранную оценку, снимаем её
      // Если есть комментарий, показываем диалог подтверждения
      if (comment.trim().length > 0) {
        setShowConfirmDialog(true);
      } else {
        // Если комментария нет, просто снимаем оценку
        onFeedbackChange?.(null, [], "");
        setComment("");
      }
    } else {
      // Выбираем новую оценку
      if (value === 'correct') {
        // Для "верно" не нужен комментарий
        onFeedbackChange?.(value, [], "");
        setComment("");
      } else {
        // Для "частично верно" и "неверно" сохраняем оценку сразу (комментарий может быть пустым)
        onFeedbackChange?.(value, [], comment.trim());
        // Сразу открываем поле комментария при выборе "частично верно" или "неверно"
        setShowCommentField(true);
      }
    }
  };

  const handleConfirmSkip = () => {
    // Пропускаем - снимаем оценку и очищаем комментарий
    onFeedbackChange?.(null, [], "");
    setComment("");
    setShowConfirmDialog(false);
  };

  const handleCommentChange = (newComment: string) => {
    setComment(newComment);
    // Сохраняем комментарий сразу при изменении, если выбрана оценка
    if (feedback && (feedback === 'partially-correct' || feedback === 'incorrect')) {
      // Сохраняем оценку с комментарием (сохраняем как есть, без trim, чтобы пользователь мог вводить пробелы)
      onFeedbackChange?.(feedback, [], newComment);
    }
  };

  return (
    <div className={`${role === "user" ? "max-w-[85%] ml-auto" : "w-full max-w-3xl"} rounded-2xl px-4 py-3 text-sm mb-2 ${
      role === "user"
        ? "bg-primary text-primary-foreground border border-primary/60 shadow-sm"
        : "bg-card"
    }`}>
      {/* Message Actions - only for user messages */}
      {role === 'user' && (onEdit || onDelete) && (
      <div className="flex gap-2 mb-1 justify-end text-muted-foreground">
        {onEdit && <button title="Edit" onClick={onEdit} className="hover:text-primary"><Edit2 size={16} /></button>}
        {onDelete && <button title="Delete" onClick={onDelete} className="hover:text-destructive"><Trash2 size={16} /></button>}
      </div>
      )}
      {/* Message Content */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, className, children, ...props}: any) {
            const match = /language-(\w+)/.exec(className || '');
            const inline = !match;
            return !inline && match ? (
              <SyntaxHighlighter style={atomDark as any} language={match[1]} PreTag="div">
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>{children}</code>
            );
          },
          a({href, children, ...props}) {
            return <a href={href} className="text-primary underline" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
          }
        }}
      >{isLoading && streaming ? `${text}▍` : text}</ReactMarkdown>
      {/* File Previews */}
      {files?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {files.map((file, i) => (
            <div key={i} className="rounded border p-2 bg-muted text-xs">
              <span className="font-medium">{file.name}</span>
              {/* Add preview based on file type here if needed */}
            </div>
          ))}
        </div>
      )}
      {/* Message Actions for assistant messages */}
      {role === 'assistant' && !isLoading && (onCopy || onFeedbackChange) && (
        <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {onCopy && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="flex items-center gap-1 px-2 py-1 rounded-xl transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                    onClick={handleCopyClick}
                  >
                    {copied ? <Check size={14} className="text-muted-foreground" /> : <Copy size={14} />}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{copied ? t('message.copied') || 'Скопировано' : t('message.copy')}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          {onFeedbackChange && (
            <div className="flex items-center gap-2">
              <button
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all border",
                  feedback === 'correct'
                    ? "bg-green-100/60 dark:bg-green-900/30 border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 font-medium"
                    : "bg-muted/80 border-border/50 text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
                onClick={() => handleFeedbackClick('correct')}
              >
                <CheckCircle2 size={14} />
                <span>Верно</span>
              </button>
              <button
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all border",
                  feedback === 'partially-correct'
                    ? "bg-yellow-100/60 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 font-medium"
                    : "bg-muted/80 border-border/50 text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
                onClick={() => handleFeedbackClick('partially-correct')}
              >
                <AlertCircle size={14} />
                <span>Частично верно</span>
              </button>
              <button
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all border",
                  feedback === 'incorrect'
                    ? "bg-red-100/60 dark:bg-red-900/30 border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 font-medium"
                    : "bg-muted/80 border-border/50 text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
                onClick={() => handleFeedbackClick('incorrect')}
              >
                <XCircle size={14} />
                <span>Неверно</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Comment field for partially-correct and incorrect feedback */}
      {role === 'assistant' && !isLoading && onFeedbackChange && (feedback === 'partially-correct' || feedback === 'incorrect') && (
        <div className="mt-3 space-y-2">
          {!showCommentField ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-3 text-xs text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                setShowCommentField(true);
              }}
            >
              Добавить отзыв (необязательно)
            </Button>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">
                  {feedback === 'partially-correct' ? 'Почему ответ частично верен?' : 'Почему ответ неверен?'}
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (comment.trim().length > 0) {
                      // Если есть текст, сохраняем его
                      onFeedbackChange?.(feedback, [], comment.trim());
                      showToast('Ваш отзыв сохранен', 'success');
                    } else {
                      // Если текста нет, просто закрываем поле
                      onFeedbackChange?.(feedback, [], "");
                    }
                    setShowCommentField(false);
                  }}
                >
                  {comment.trim().length > 0 ? 'Сохранить' : 'Пропустить'}
                </Button>
              </div>
              <Textarea
                value={comment}
                onChange={(e) => handleCommentChange(e.target.value)}
                placeholder={feedback === 'partially-correct' 
                  ? 'Опишите, что неверно или что можно улучшить...' 
                  : 'Опишите, что неверно в ответе...'}
                rows={3}
                className="text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                maxLength={500}
                onFocus={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              />
            </>
          )}
        </div>
      )}

      {/* Duration for assistant messages */}
      {role === 'assistant' && !isLoading && durationMs !== undefined && (
        <div className="mt-3 flex items-center text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Timer size={14} className="text-muted-foreground" />
            {(durationMs / 1000).toFixed(1)}s
          </span>
        </div>
      )}

      {/* Confirmation dialog when removing feedback with comment */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Снять оценку?</AlertDialogTitle>
            <AlertDialogDescription>
              У вас есть комментарий к этой оценке. Комментарий будет удален вместе с оценкой.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel>
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSkip} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Пропустить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};
