import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send } from "lucide-react";

interface ChatComposerProps {
  value: string;
  placeholder?: string;
  examples?: string[];
  exampleIntervalMs?: number;
  onChange: (value: string) => void;
  onSend: (value: string) => void;
  onAttachClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ChatComposer({
  value,
  placeholder,
  examples,
  exampleIntervalMs = 3000,
  onChange,
  onSend,
  onAttachClick,
  disabled,
  className
}: ChatComposerProps) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const minHeight = 80; // min-h-[80px]
  const maxHeight = minHeight * 3; // максимум в 3 раза
  
  const dynamicPlaceholder = useMemo(() => {
    if (placeholder) return placeholder;
    if (examples && examples.length > 0) return examples[exampleIndex % examples.length];
    return "";
  }, [placeholder, examples, exampleIndex]);

  useEffect(() => {
    if (!examples || examples.length === 0) return;
    const id = setInterval(() => {
      setExampleIndex(prev => prev + 1);
    }, exampleIntervalMs);
    return () => clearInterval(id);
  }, [examples, exampleIntervalMs]);

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to get correct scrollHeight
    textarea.style.height = `${minHeight}px`;
    
    // Calculate new height
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(scrollHeight, maxHeight);
    
    // Set new height
    textarea.style.height = `${newHeight}px`;
    
    // Enable scroll if content exceeds max height
    if (scrollHeight > maxHeight) {
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.overflowY = 'hidden';
    }
  }, [minHeight, maxHeight]);

  // Adjust height when value changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [value, adjustTextareaHeight]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    // Height adjustment will happen in useEffect
  }, [onChange]);
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = value.trim();
      if (text.length > 0 && !disabled) {
        onSend(text);
        // Reset textarea height after sending
        if (textareaRef.current) {
          textareaRef.current.style.height = `${minHeight}px`;
          textareaRef.current.style.overflowY = 'hidden';
        }
      }
    }
  }, [onSend, value, disabled, minHeight]);

  const handleClickSend = useCallback(() => {
    const text = value.trim();
    if (text.length > 0 && !disabled) {
      onSend(text);
      // Reset textarea height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = `${minHeight}px`;
        textareaRef.current.style.overflowY = 'hidden';
      }
    }
  }, [onSend, value, disabled, minHeight]);

  // Auto-focus on mount
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  return (
    <div 
      className={`relative border border-border/50 rounded-2xl bg-muted/50 hover:bg-muted/70 transition-colors ${className || ''}`}
      onClick={(e) => {
        // If click is on the container (not on buttons), focus textarea
        if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'DIV') {
          textareaRef.current?.focus();
        }
      }}
    >
      {/* Textarea with padding so icons don't overlap content */}
      <Textarea
        ref={textareaRef}
        placeholder={dynamicPlaceholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          // Ensure textarea is focused
          e.currentTarget.focus();
        }}
        onClick={(e) => {
          // Stop propagation to prevent container click handler
          e.stopPropagation();
          e.currentTarget.focus();
        }}
        disabled={disabled}
        className="resize-none border-0 bg-transparent p-3 pr-12 pl-11 text-sm placeholder:text-left focus-visible:ring-0 focus-visible:ring-offset-0 relative z-10 w-full"
        style={{ minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px` }}
        autoFocus={!disabled}
      />

      {/* Attach (bottom-left) */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute bottom-2 left-3 h-8 w-8 z-20"
        onClick={(e) => {
          e.stopPropagation();
          onAttachClick?.();
        }}
        disabled={disabled}
      >
        <Paperclip className="h-4 w-4" />
      </Button>

      {/* Send (bottom-right) */}
      <Button
        type="button"
        variant="default"
        size="icon"
        className="absolute bottom-2 right-2 h-8 w-8 z-20"
        onClick={(e) => {
          e.stopPropagation();
          handleClickSend();
        }}
        disabled={disabled}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
