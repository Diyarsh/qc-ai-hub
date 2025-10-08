import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot } from "lucide-react";

interface ProjectSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectSettingsDialog({ open, onOpenChange }: ProjectSettingsDialogProps) {
  const [instructions, setInstructions] = useState("");
  const [model, setModel] = useState("gpt-4-turbo");

  const handleSave = () => {
    // Save logic here
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Настройки проекта</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Инструкции проекта</Label>
            <Textarea
              placeholder="Добавьте инструкции о тоне, стиле и персоне, которую должен принять AI"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Предпочитаемая модель</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4-turbo">
                  <div>
                    <div className="font-medium">GPT-4 Turbo</div>
                    <div className="text-xs text-muted-foreground">Fast and accurate responses</div>
                  </div>
                </SelectItem>
                <SelectItem value="gpt-4">
                  <div>
                    <div className="font-medium">GPT-4</div>
                    <div className="text-xs text-muted-foreground">Most capable model</div>
                  </div>
                </SelectItem>
                <SelectItem value="gpt-3.5-turbo">
                  <div>
                    <div className="font-medium">GPT-3.5 Turbo</div>
                    <div className="text-xs text-muted-foreground">Faster and more affordable</div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отменить
          </Button>
          <Button onClick={handleSave}>
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
