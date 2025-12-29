import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ClipboardCopyIcon, RefreshCw, Edit2, Trash2 } from "lucide-react";
import { MessageEvaluationComponent } from "./MessageEvaluation";

interface MessageBubbleProps {
  text: string;
  role: 'user' | 'assistant';
  messageId?: string;
  isLoading?: boolean;
  streaming?: boolean;
  onRegenerate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopy?: (text: string) => void;
  files?: { name: string; url?: string; type?: string }[];
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
  onCopy,
  files = [],
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (onCopy) onCopy(text);
    else navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm border shadow-sm mb-2 ${
      role === "user"
        ? "bg-primary text-primary-foreground border-primary/60 ml-auto"
        : "bg-card border-border mr-auto"
    }`}>
      {/* Message Actions */}
      <div className="flex gap-2 mb-1 justify-end text-muted-foreground">
        <button title="Copy" onClick={handleCopy} className="hover:text-primary"><ClipboardCopyIcon size={16} /></button>
        {onRegenerate && <button title="Regenerate" onClick={onRegenerate} className="hover:text-primary"><RefreshCw size={16} /></button>}
        {onEdit && <button title="Edit" onClick={onEdit} className="hover:text-primary"><Edit2 size={16} /></button>}
        {onDelete && <button title="Delete" onClick={onDelete} className="hover:text-destructive"><Trash2 size={16} /></button>}
        {copied && <span className="text-xs ml-2 text-green-700">Copied!</span>}
      </div>
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
      {role === 'assistant' && !isLoading && messageId && (
        <MessageEvaluationComponent messageId={messageId} compact={true} />
      )}
    </div>
  );
};

