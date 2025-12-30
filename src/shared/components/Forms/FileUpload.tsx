import { useCallback, useState } from "react";
import { Upload, File, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes?: string[];
  multiple?: boolean;
  maxSizeMB?: number;
}

export function FileUpload({
  onFilesSelected,
  acceptedTypes = [".pdf", ".docx", ".txt"],
  multiple = true,
  maxSizeMB = 50,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      validateAndSetFiles(files);
    },
    []
  );

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    validateAndSetFiles(files);
  }, []);

  const validateAndSetFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const extension = "." + file.name.split(".").pop()?.toLowerCase();
      const isValidType = acceptedTypes.some((type) => type.toLowerCase() === extension);
      const isValidSize = file.size <= maxSizeMB * 1024 * 1024;
      return isValidType && isValidSize;
    });
    const newFiles = multiple ? [...selectedFiles, ...validFiles] : validFiles;
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-2xl p-8 text-center transition-colors",
          isDragging ? "border-blue-500 bg-blue-50/10" : "border-border bg-muted/30"
        )}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          Перетащите файлы сюда или нажмите для выбора
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Поддерживаемые форматы: {acceptedTypes.join(", ")} (макс. {maxSizeMB}MB)
        </p>
        <input
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button type="button" variant="outline" asChild>
            <span>Выбрать файлы</span>
          </Button>
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Выбранные файлы:</p>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl"
            >
              <File className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

