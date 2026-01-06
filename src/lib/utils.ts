import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extract plain text from markdown string
 * Removes markdown syntax, code blocks, and formatting
 */
export function extractTextFromMarkdown(markdown: string): string {
  if (!markdown) return '';
  
  // Remove code blocks (```code```)
  let text = markdown.replace(/```[\s\S]*?```/g, '');
  
  // Remove inline code (`code`)
  text = text.replace(/`[^`]*`/g, '');
  
  // Remove headers (# ## ###)
  text = text.replace(/^#{1,6}\s+/gm, '');
  
  // Remove bold/italic (**text** or *text*)
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');
  
  // Remove links [text](url)
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  
  // Remove images ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '');
  
  // Remove horizontal rules (---)
  text = text.replace(/^---+$/gm, '');
  
  // Remove list markers (- * +)
  text = text.replace(/^[\s]*[-*+]\s+/gm, '');
  text = text.replace(/^[\s]*\d+\.\s+/gm, '');
  
  // Remove blockquotes (>)
  text = text.replace(/^>\s+/gm, '');
  
  // Clean up multiple newlines
  text = text.replace(/\n{3,}/g, '\n\n');
  
  // Trim whitespace
  text = text.trim();
  
  return text;
}
