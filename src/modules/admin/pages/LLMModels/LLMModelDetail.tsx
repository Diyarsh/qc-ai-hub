import { Modal } from "@/shared/components/Modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/shared/components/Badge";
import { LLMModel } from "./mockData";
import { Pencil } from "lucide-react";

interface LLMModelDetailProps {
  model: LLMModel;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export function LLMModelDetail({ model, isOpen, onClose, onEdit }: LLMModelDetailProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={model.name} size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Провайдер</p>
            <Badge variant="info">{model.provider}</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Статус</p>
            <Badge variant={model.enabled ? "success" : "error"}>
              {model.enabled ? "Включена" : "Отключена"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Max Tokens</p>
            <p className="font-medium">{model.maxTokens.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Temperature</p>
            <p className="font-medium">{model.temperature.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Локальная модель</p>
            <Badge variant={model.isLocal ? "success" : "default"}>
              {model.isLocal ? "Да" : "Нет"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Поддерживает чат</p>
            <Badge variant={model.chatCapable ? "success" : "default"}>
              {model.chatCapable ? "Да" : "Нет"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Создана</p>
            <p className="font-medium">
              {new Date(model.createdAt).toLocaleDateString("ru-RU")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Обновлена</p>
            <p className="font-medium">
              {new Date(model.updatedAt).toLocaleDateString("ru-RU")}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Описание</p>
          <p className="text-sm bg-muted/30 p-3 rounded-md">{model.description}</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
          <Button onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
        </div>
      </div>
    </Modal>
  );
}

