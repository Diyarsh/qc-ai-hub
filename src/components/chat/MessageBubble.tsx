import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Edit2, Trash2, Timer, Copy, Check, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
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
  const [copied, setCopied] = useState(false);
  const [comment, setComment] = useState(feedbackDetails || "");
  const [showCommentField, setShowCommentField] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const feedbackContainerRef = useRef<HTMLDivElement>(null);
  const commentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedComment = feedbackDetails || "";
    setComment(savedComment);
    if (savedComment.trim().length > 0) {
      setShowCommentField(true);
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
      onFeedbackChange?.(null, [], "");
      setComment("");
      setShowCommentField(false);
      setSubmitted(false);
    } else {
      // Выбираем новую оценку
      onFeedbackChange?.(value, [], comment.trim());
      if (value === 'correct') {
        setComment("");
        setShowCommentField(false);
        setSubmitted(true);
      } else {
        setShowCommentField(true);
        setSubmitted(false);
      }
    }
  };

  const handleCommentChange = (newComment: string) => {
    setComment(newComment);
    if (feedback && (feedback === 'partially-correct' || feedback === 'incorrect')) {
      onFeedbackChange?.(feedback, [], newComment);
    }
  };

  const completeFeedback = () => {
    if (feedback) {
      onFeedbackChange?.(feedback, [], comment.trim());
      setSubmitted(true);
    }
  };

  const handleSave = () => {
    completeFeedback();
  };

  const handleSkip = () => {
    completeFeedback();
  };

  const needsComment = (feedback === 'partially-correct' || feedback === 'incorrect') && showCommentField && !submitted;

  const hasFeedback = role === 'assistant' && onFeedbackChange && !isLoading;
  const hasComment = role === 'assistant' && !isLoading && needsComment && !submitted;

  // Синхронизация ширины контейнера комментария с контейнером отзывов
  useEffect(() => {
    if (feedbackContainerRef.current && commentContainerRef.current) {
      const feedbackWidth = feedbackContainerRef.current.offsetWidth;
      commentContainerRef.current.style.width = `${feedbackWidth}px`;
    }
  }, [hasComment, feedback, showCommentField]);
  
  return (
    <div className={`${role === "user" ? "max-w-[85%] ml-auto" : "w-full max-w-3xl"} relative rounded-2xl px-4 py-3 text-sm ${hasFeedback || hasComment ? "mb-20" : "mb-2"} ${
      role === "user"
        ? "bg-muted text-foreground border border-border/50 shadow-sm"
        : "bg-card border border-border/50 shadow-sm"
    }`}>
      {/* Message Actions - only for user messages */}
      {role === 'user' && (onEdit || onDelete) && (
      <div className="flex gap-2 mb-1 justify-end text-muted-foreground">
        {onEdit && <button title="Edit" onClick={onEdit} className="hover:text-foreground transition-colors"><Edit2 size={16} /></button>}
        {onDelete && <button title="Delete" onClick={onDelete} className="hover:text-destructive transition-colors"><Trash2 size={16} /></button>}
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
      {role === 'assistant' && !isLoading && onCopy && (
        <div className="mt-3 flex items-center gap-2">
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
        </div>
      )}
      
      {/* Feedback container positioned on the border */}
      {role === 'assistant' && !isLoading && onFeedbackChange && (
        <div ref={feedbackContainerRef} className="absolute -bottom-3 right-4 flex items-center gap-0 flex-wrap border border-border/50 rounded-xl overflow-hidden bg-background divide-x divide-border/50 shadow-md">
          <button
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-l-lg text-sm font-medium transition-all",
              feedback === 'correct'
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-green-100/60 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-300"
            )}
            onClick={() => handleFeedbackClick('correct')}
          >
            <CheckCircle2 size={16} />
            <span>Верно</span>
          </button>
          <button
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium transition-all",
              feedback === 'partially-correct'
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-yellow-100/60 dark:hover:bg-yellow-900/30 hover:text-yellow-700 dark:hover:text-yellow-300"
            )}
            onClick={() => handleFeedbackClick('partially-correct')}
          >
            <AlertCircle size={16} />
            <span>Частично верно</span>
          </button>
          <button
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-r-lg text-sm font-medium transition-all",
              feedback === 'incorrect'
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-pink-100/60 dark:hover:bg-pink-900/30 hover:text-pink-700 dark:hover:text-pink-300"
            )}
            onClick={() => handleFeedbackClick('incorrect')}
          >
            <XCircle size={16} />
            <span>Неверно</span>
          </button>
        </div>
      )}

      {/* Блок отзыва: текст + поле комментария + Сохранить / Пропустить */}
      {role === 'assistant' && !isLoading && needsComment && !submitted && (
        <div ref={commentContainerRef} className="absolute -bottom-3 right-4 translate-y-full mt-1 bg-muted/80 border border-border/50 rounded-xl px-2 py-1.5 shadow-sm space-y-1.5 z-50">
          <Textarea
            value={comment}
            onChange={(e) => handleCommentChange(e.target.value)}
            placeholder={feedback === 'partially-correct'
              ? 'Опишите, что неверно или что можно улучшить...'
              : 'Опишите, что неверно в ответе...'}
            rows={2}
            className="text-xs focus-visible:ring-0 focus-visible:ring-offset-0 resize-none bg-background/50 w-full"
            maxLength={500}
            onFocus={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-muted-foreground">{comment.length}/500</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSkip}
                className="text-[11px] font-medium text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-background/50 transition-colors"
              >
                Пропустить
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="text-[11px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-2 py-1 rounded-md transition-colors"
              >
                Сохранить
              </button>
            </div>
          </div>
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

    </div>
  );
};
