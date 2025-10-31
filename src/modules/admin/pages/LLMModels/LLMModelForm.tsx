import { useState, useEffect } from "react";
import { Modal } from "@/shared/components/Modal";
import { Input } from "@/shared/components/Forms/Input";
import { Select } from "@/shared/components/Forms/Select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { LLMModel, LLMProvider } from "./mockData";

interface LLMModelFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (model: Partial<LLMModel> & { id?: number }) => void;
  model?: LLMModel | null;
}

const PROVIDERS: { value: LLMProvider; label: string }[] = [
  { value: "OPENAI", label: "OpenAI" },
  { value: "DEEPSEEK", label: "DeepSeek" },
  { value: "LLAMA", label: "Llama" },
  { value: "QWEN", label: "Qwen" },
  { value: "GEMMA", label: "Gemma" },
];

export function LLMModelForm({ isOpen, onClose, onSubmit, model }: LLMModelFormProps) {
  const isEdit = !!model;
  const [formData, setFormData] = useState({
    name: "",
    provider: "OPENAI" as LLMProvider,
    maxTokens: 4096,
    temperature: 0.7,
    isLocal: false,
    chatCapable: true,
    enabled: true,
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (model) {
      setFormData({
        name: model.name,
        provider: model.provider,
        maxTokens: model.maxTokens,
        temperature: model.temperature,
        isLocal: model.isLocal,
        chatCapable: model.chatCapable,
        enabled: model.enabled,
        description: model.description,
      });
    } else {
      setFormData({
        name: "",
        provider: "OPENAI",
        maxTokens: 4096,
        temperature: 0.7,
        isLocal: false,
        chatCapable: true,
        enabled: true,
        description: "",
      });
    }
    setErrors({});
  }, [model, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Название обязательно";
    }
    if (formData.maxTokens < 100 || formData.maxTokens > 100000) {
      newErrors.maxTokens = "Max Tokens должен быть между 100 и 100000";
    }
    if (formData.temperature < 0 || formData.temperature > 1) {
      newErrors.temperature = "Temperature должен быть между 0 и 1";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData: Partial<LLMModel> & { id?: number } = {
      name: formData.name.trim(),
      provider: formData.provider,
      maxTokens: formData.maxTokens,
      temperature: formData.temperature,
      isLocal: formData.isLocal,
      chatCapable: formData.chatCapable,
      enabled: formData.enabled,
      description: formData.description.trim(),
      updatedAt: new Date().toISOString(),
    };

    if (isEdit && model) {
      submitData.id = model.id;
      submitData.createdAt = model.createdAt;
    } else {
      submitData.createdAt = new Date().toISOString();
    }

    onSubmit(submitData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Редактировать LLM модель" : "Создать LLM модель"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Название *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
        />

        <Select
          label="Провайдер *"
          value={formData.provider}
          onChange={(e) => setFormData({ ...formData, provider: e.target.value as LLMProvider })}
          options={PROVIDERS}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Max Tokens *"
            type="number"
            min={100}
            max={100000}
            value={formData.maxTokens}
            onChange={(e) =>
              setFormData({ ...formData, maxTokens: parseInt(e.target.value) || 0 })
            }
            error={errors.maxTokens}
            required
          />

          <div className="space-y-2">
            <Label>
              Temperature: {formData.temperature.toFixed(1)}
            </Label>
            <Slider
              value={[formData.temperature]}
              onValueChange={(value) =>
                setFormData({ ...formData, temperature: value[0] })
              }
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
            {errors.temperature && (
              <p className="text-sm text-red-500">{errors.temperature}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Switch
              checked={formData.isLocal}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isLocal: checked })
              }
            />
            <Label>Локальная модель</Label>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={formData.chatCapable}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, chatCapable: checked })
              }
            />
            <Label>Поддерживает чат</Label>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={formData.enabled}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, enabled: checked })
              }
            />
            <Label>Активирована</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Описание</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose}>
            Отменить
          </Button>
          <Button type="submit">{isEdit ? "Сохранить" : "Создать"}</Button>
        </div>
      </form>
    </Modal>
  );
}

