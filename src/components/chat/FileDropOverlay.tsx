import { useCallback, useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_ACCEPTED_TYPES = [".pdf", ".docx", ".doc", ".txt", ".md", ".csv", ".xlsx", ".xls", ".png", ".jpg", ".jpeg"];
const DEFAULT_MAX_SIZE_MB = 50;

interface FileDropOverlayProps {
  onFilesDropped: (files: File[]) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  enabled?: boolean;
}

function validateFiles(files: File[], acceptedTypes: string[], maxSizeMB: number): File[] {
  return files.filter((file) => {
    const ext = "." + (file.name.split(".").pop()?.toLowerCase() || "");
    const isValidType = acceptedTypes.some((t) => t.toLowerCase() === ext);
    const isValidSize = file.size <= maxSizeMB * 1024 * 1024;
    return isValidType && isValidSize;
  });
}

export function FileDropOverlay({
  onFilesDropped,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  enabled = true,
}: FileDropOverlayProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e: DragEvent) => {
    if (!enabled) return;
    e.preventDefault();
    const hasFiles = e.dataTransfer?.types?.includes("Files");
    if (hasFiles) {
      setDragCounter((c) => c + 1);
      setIsDragging(true);
    }
  }, [enabled]);

  const handleDragLeave = useCallback((e: DragEvent) => {
    if (!enabled) return;
    e.preventDefault();
    setDragCounter((c) => Math.max(0, c - 1));
  }, [enabled]);

  const handleDragOver = useCallback((e: DragEvent) => {
    if (!enabled) return;
    e.preventDefault();
    e.stopPropagation();
  }, [enabled]);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      if (!enabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setDragCounter(0);

      const files = Array.from(e.dataTransfer?.files || []);
      if (files.length === 0) return;

      const validFiles = validateFiles(files, acceptedTypes, maxSizeMB);
      if (validFiles.length > 0) {
        onFilesDropped(validFiles);
      }
    },
    [enabled, acceptedTypes, maxSizeMB, onFilesDropped]
  );

  useEffect(() => {
    if (!enabled) return;

    const el = document;
    el.addEventListener("dragenter", handleDragEnter);
    el.addEventListener("dragleave", handleDragLeave);
    el.addEventListener("dragover", handleDragOver);
    el.addEventListener("drop", handleDrop);

    return () => {
      el.removeEventListener("dragenter", handleDragEnter);
      el.removeEventListener("dragleave", handleDragLeave);
      el.removeEventListener("dragover", handleDragOver);
      el.removeEventListener("drop", handleDrop);
    };
  }, [enabled, handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  useEffect(() => {
    if (dragCounter === 0) setIsDragging(false);
  }, [dragCounter]);

  if (!isDragging) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center",
        "bg-background/80 backdrop-blur-sm",
        "border-2 border-dashed border-primary/50 rounded-none",
        "animate-in fade-in-0 duration-200"
      )}
    >
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-card/95 border border-border shadow-xl">
        <div className="rounded-full bg-primary/10 p-4">
          <Upload className="h-12 w-12 text-primary" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-lg font-semibold">Отпустите файлы для прикрепления</p>
          <p className="text-sm text-muted-foreground">
            Поддерживаются: {acceptedTypes.slice(0, 6).join(", ")}… (макс. {maxSizeMB}MB)
          </p>
        </div>
      </div>
    </div>
  );
}
