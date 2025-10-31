import { useState } from "react";
import { LLMModelList } from "./LLMModelList";
import { mockLLMModels, LLMModel } from "./mockData";

export default function LLMModels() {
  const [models, setModels] = useState<LLMModel[]>(mockLLMModels);

  const handleCreate = (modelData: Partial<LLMModel> & { id?: number }) => {
    const newModel: LLMModel = {
      id: Math.max(...models.map((m) => m.id), 0) + 1,
      name: modelData.name!,
      provider: modelData.provider!,
      maxTokens: modelData.maxTokens!,
      temperature: modelData.temperature!,
      isLocal: modelData.isLocal ?? false,
      chatCapable: modelData.chatCapable ?? true,
      enabled: modelData.enabled ?? true,
      description: modelData.description || "",
      createdAt: modelData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setModels([...models, newModel]);
  };

  const handleUpdate = (modelData: Partial<LLMModel> & { id?: number }) => {
    setModels(
      models.map((m) =>
        m.id === modelData.id ? { ...m, ...modelData } : m
      ) as LLMModel[]
    );
  };

  const handleDelete = (id: number) => {
    setModels(models.filter((m) => m.id !== id));
  };

  return (
    <LLMModelList
      models={models}
      onModelCreate={handleCreate}
      onModelUpdate={handleUpdate}
      onModelDelete={handleDelete}
    />
  );
}

