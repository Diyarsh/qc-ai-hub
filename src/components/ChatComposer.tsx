import { useCallback, useEffect, useMemo, useState } from "react";
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
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = value.trim();
      if (text.length > 0 && !disabled) {
        onSend(text);
      }
    }
  }, [onSend, value, disabled]);

  const handleClickSend = useCallback(() => {
    const text = value.trim();
    if (text.length > 0 && !disabled) {
      onSend(text);
    }
  }, [onSend, value, disabled]);

  return (
    <div className={`relative border border-border rounded-xl bg-background ${className || ''}`}>
      {/* Attach (bottom-left) */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute bottom-2 left-3 h-8 w-8"
        onClick={onAttachClick}
        disabled={disabled}
      >
        <Paperclip className="h-4 w-4" />
      </Button>

      {/* Send (bottom-right) */}
      <Button
        type="button"
        size="icon"
        className="absolute bottom-2 right-2 h-8 w-8"
        onClick={handleClickSend}
        disabled={disabled}
      >
        <Send className="h-4 w-4" />
      </Button>

      {/* Textarea with padding so icons don’t overlap content */}
      <Textarea
        placeholder={dynamicPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[68px] resize-none border-0 bg-transparent p-3 pr-12 pl-10 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        rows={3}
      />
    </div>
  );
}
