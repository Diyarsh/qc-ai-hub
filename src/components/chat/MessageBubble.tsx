import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Edit2, Trash2, Timer, Copy, MessageSquare } from "lucide-react";
import { FeedbackModal } from "./FeedbackModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  onFeedbackChange,
}) => {
  const { t } = useLanguage();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <div className={`${role === "user" ? "max-w-[85%] ml-auto" : "w-full max-w-3xl"} rounded-2xl px-4 py-3 text-sm border shadow-sm mb-2 ${
      role === "user"
        ? "bg-primary text-primary-foreground border-primary/60"
        : "bg-card border-border"
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
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {onCopy && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex items-center gap-1 px-2 py-1 rounded-xl transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                  onClick={onCopy}
                >
                  <Copy size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('message.copy')}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {onFeedbackChange && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex items-center gap-1 px-2 py-1 rounded-xl transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                  onClick={() => setShowFeedbackModal(true)}
                >
                  <MessageSquare size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('message.feedback')}</p>
              </TooltipContent>
            </Tooltip>
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

      {/* Feedback Modal */}
      {onFeedbackChange && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={(type, details) => {
            onFeedbackChange(type, [], details);
            setShowFeedbackModal(false);
          }}
          currentFeedback={feedback}
        />
      )}
    </div>
  );
};
