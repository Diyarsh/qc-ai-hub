import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, FolderOpen, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [projectInstructions, setProjectInstructions] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 1 && projectName.trim()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleComplete = () => {
    // Navigate to project chat
    navigate('/project-chat');
    onOpenChange(false);
    // Reset state
    setStep(1);
    setProjectName("");
    setProjectInstructions("");
    setFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setStep(1);
    setProjectName("");
    setProjectInstructions("");
    setFiles([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Название проекта
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  placeholder="Введите название проекта"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions">Инструкции проекта</Label>
                <Textarea
                  id="instructions"
                  placeholder="Добавьте инструкции о tone, стиле и персоне, которую должен принять AI"
                  rows={6}
                  value={projectInstructions}
                  onChange={(e) => setProjectInstructions(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={handleCancel}>
                Отмена
              </Button>
              <Button onClick={handleNext} disabled={!projectName.trim()}>
                Далее
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Файлы проекта
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center">
                <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Добавить файлы проекта</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Начните с прикрепления файлов к вашему проекту. Они будут использоваться во всех чатах этого проекта.
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" asChild>
                    <span className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Прикрепить
                    </span>
                  </Button>
                </label>
                {files.length > 0 && (
                  <div className="mt-4 w-full text-left">
                    <p className="text-sm font-medium mb-2">Выбрано файлов: {files.length}</p>
                    <div className="space-y-1">
                      {files.map((file, index) => (
                        <p key={index} className="text-xs text-muted-foreground truncate">
                          {file.name}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={handleBack}>
                Назад
              </Button>
              <Button onClick={handleComplete}>
                Готово
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
