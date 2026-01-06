import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { RefreshCw, Edit2, Trash2, ThumbsUp, ThumbsDown, Timer } from "lucide-react";
import { FeedbackDialog } from "./FeedbackDialog";

interface MessageBubbleProps {
  text: string;
  role: 'user' | 'assistant';
  messageId?: string;
  isLoading?: boolean;
  streaming?: boolean;
  onRegenerate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  files?: { name: string; url?: string; type?: string }[];
  durationMs?: number;
  feedback?: 'like' | 'dislike';
  onFeedbackChange?: (value: 'like' | 'dislike' | null, reasons?: string[], details?: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  role,
  messageId,
  isLoading,
  streaming,
  onRegenerate,
  onEdit,
  onDelete,
  files = [],
  durationMs,
  feedback,
  onFeedbackChange,
}) => {
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  return (
    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm border shadow-sm mb-2 ${
      role === "user"
        ? "bg-primary text-primary-foreground border-primary/60 ml-auto"
        : "bg-card border-border mr-auto"
    }`}>
      {/* Message Actions - only for user messages */}
      {role === 'user' && (onRegenerate || onEdit || onDelete) && (
      <div className="flex gap-2 mb-1 justify-end text-muted-foreground">
        {onRegenerate && <button title="Regenerate" onClick={onRegenerate} className="hover:text-primary"><RefreshCw size={16} /></button>}
        {onEdit && <button title="Edit" onClick={onEdit} className="hover:text-primary"><Edit2 size={16} /></button>}
        {onDelete && <button title="Delete" onClick={onDelete} className="hover:text-destructive"><Trash2 size={16} /></button>}
      </div>
      )}
      {/* Message Content */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>
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
      {/* Evaluation for assistant messages */}
      {role === 'assistant' && !isLoading && (
        <>
          <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-3">
              {durationMs !== undefined && (
                <span className="inline-flex items-center gap-1">
                  <Timer size={14} className="text-muted-foreground" />
                  {(durationMs / 1000).toFixed(1)}s
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                className={`flex items-center gap-1 px-2 py-1 rounded-xl transition-colors ${
                  feedback === 'like'
                    ? 'bg-primary/15 text-primary'
                    : 'hover:bg-muted'
                }`}
                onClick={() => {
                  if (feedback === 'like') {
                    onFeedbackChange?.(null);
                  } else {
                    onFeedbackChange?.('like');
                  }
                }}
                title="Нравится"
              >
                {feedback === 'like' ? (
                  <ThumbsUp size={14} fill="currentColor" strokeWidth={0} />
                ) : (
                  <ThumbsUp size={14} />
                )}
              </button>
              <button
                className={`flex items-center gap-1 px-2 py-1 rounded-xl transition-colors ${
                  feedback === 'dislike'
                    ? 'bg-destructive/10 text-destructive'
                    : 'hover:bg-muted'
                }`}
                onClick={() => {
                  if (feedback === 'dislike') {
                    onFeedbackChange?.(null);
                    setShowFeedbackDialog(false);
                  } else {
                    setShowFeedbackDialog(true);
                  }
                }}
                title="Не нравится"
              >
                {feedback === 'dislike' ? (
                  <ThumbsDown size={14} fill="currentColor" strokeWidth={0} />
                ) : (
                  <ThumbsDown size={14} />
                )}
              </button>
            </div>
          </div>

          {/* Feedback Dialog */}
          <FeedbackDialog
            isOpen={showFeedbackDialog}
            onClose={() => setShowFeedbackDialog(false)}
            onSubmit={(reasons, details) => {
              onFeedbackChange?.('dislike', reasons, details);
              setShowFeedbackDialog(false);
            }}
          />
        </>
      )}
    </div>
  );
};

