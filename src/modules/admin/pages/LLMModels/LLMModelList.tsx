import { useState, useMemo } from "react";
import { Pencil, Trash2, Plus, Search, Eye } from "lucide-react";
import { DataTable, Column } from "@/shared/components/Table/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/Forms/Input";
import { Select } from "@/shared/components/Forms/Select";
import { Badge } from "@/shared/components/Badge";
import { Modal } from "@/shared/components/Modal";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/shared/components/Toast";
import { LLMModel, LLMProvider } from "./mockData";
import { LLMModelForm } from "./LLMModelForm";
import { LLMModelDetail } from "./LLMModelDetail";

interface LLMModelListProps {
  models: LLMModel[];
  onModelCreate: (model: Partial<LLMModel> & { id?: number }) => void;
  onModelUpdate: (model: Partial<LLMModel> & { id?: number }) => void;
  onModelDelete: (id: number) => void;
}

const PROVIDERS: { value: LLMProvider | ""; label: string }[] = [
  { value: "", label: "Все провайдеры" },
  { value: "OPENAI", label: "OpenAI" },
  { value: "DEEPSEEK", label: "DeepSeek" },
  { value: "LLAMA", label: "Llama" },
  { value: "QWEN", label: "Qwen" },
  { value: "GEMMA", label: "Gemma" },
];

export function LLMModelList({
  models,
  onModelCreate,
  onModelUpdate,
  onModelDelete,
}: LLMModelListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState<LLMProvider | "">("");
  const [enabledFilter, setEnabledFilter] = useState<boolean | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<LLMModel | null>(null);
  const [viewingModel, setViewingModel] = useState<LLMModel | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; model: LLMModel | null }>({
    isOpen: false,
    model: null,
  });
  const { showToast } = useToast();

  const filteredModels = useMemo(() => {
    return models.filter((model) => {
      const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProvider = !providerFilter || model.provider === providerFilter;
      const matchesEnabled =
        enabledFilter === null || model.enabled === enabledFilter;
      return matchesSearch && matchesProvider && matchesEnabled;
    });
  }, [models, searchQuery, providerFilter, enabledFilter]);

  const handleCreate = () => {
    setEditingModel(null);
    setIsFormOpen(true);
  };

  const handleEdit = (model: LLMModel) => {
    setEditingModel(model);
    setIsFormOpen(true);
  };

  const handleView = (model: LLMModel) => {
    setViewingModel(model);
  };

  const handleDelete = (model: LLMModel) => {
    setDeleteConfirm({ isOpen: true, model });
  };

  const confirmDelete = () => {
    if (deleteConfirm.model) {
      onModelDelete(deleteConfirm.model.id);
      showToast("Модель удалена", "success");
      setDeleteConfirm({ isOpen: false, model: null });
    }
  };

  const handleFormSubmit = (modelData: Partial<LLMModel> & { id?: number }) => {
    if (editingModel) {
      onModelUpdate(modelData);
      showToast("Модель обновлена", "success");
    } else {
      onModelCreate(modelData);
      showToast("Модель создана", "success");
    }
    setIsFormOpen(false);
    setEditingModel(null);
  };

  const toggleEnabled = (model: LLMModel) => {
    onModelUpdate({ ...model, enabled: !model.enabled });
    showToast(
      model.enabled ? "Модель отключена" : "Модель включена",
      "info"
    );
  };

  const columns: Column<LLMModel>[] = [
    {
      key: "id",
      label: "ID",
      sortable: true,
    },
    {
      key: "name",
      label: "Название",
      sortable: true,
    },
    {
      key: "provider",
      label: "Провайдер",
      render: (_, row) => (
        <Badge
          variant={
            row.provider === "OPENAI"
              ? "info"
              : row.provider === "DEEPSEEK"
              ? "default"
              : "success"
          }
        >
          {row.provider}
        </Badge>
      ),
    },
    {
      key: "maxTokens",
      label: "Max Tokens",
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: "temperature",
      label: "Temperature",
      render: (value) => value.toFixed(1),
    },
    {
      key: "chatCapable",
      label: "Chat",
      render: (_, row) => (
        <Badge variant={row.chatCapable ? "success" : "default"}>
          {row.chatCapable ? "Да" : "Нет"}
        </Badge>
      ),
    },
    {
      key: "enabled",
      label: "Статус",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.enabled}
            onCheckedChange={() => toggleEnabled(row)}
            onClick={(e) => e.stopPropagation()}
          />
          <Badge variant={row.enabled ? "success" : "error"}>
            {row.enabled ? "Включена" : "Отключена"}
          </Badge>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">LLM Модели</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Создать модель
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select
          value={providerFilter}
          onChange={(e) => setProviderFilter(e.target.value as LLMProvider | "")}
          options={PROVIDERS}
          className="w-48"
        />
        <div className="flex gap-2">
          <Button
            variant={enabledFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setEnabledFilter(null)}
          >
            Все
          </Button>
          <Button
            variant={enabledFilter === true ? "default" : "outline"}
            size="sm"
            onClick={() => setEnabledFilter(true)}
          >
            Включенные
          </Button>
          <Button
            variant={enabledFilter === false ? "default" : "outline"}
            size="sm"
            onClick={() => setEnabledFilter(false)}
          >
            Отключенные
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredModels}
        actions={(row) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleView(row);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row);
              }}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </>
        )}
        emptyMessage="Модели не найдены"
      />

      <LLMModelForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingModel(null);
        }}
        onSubmit={handleFormSubmit}
        model={editingModel}
      />

      {viewingModel && (
        <LLMModelDetail
          model={viewingModel}
          isOpen={!!viewingModel}
          onClose={() => setViewingModel(null)}
          onEdit={() => {
            setViewingModel(null);
            setEditingModel(viewingModel);
            setIsFormOpen(true);
          }}
        />
      )}

      <Modal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, model: null })}
        title="Подтверждение удаления"
        size="sm"
      >
        <div className="space-y-4">
          <p>
            Вы уверены, что хотите удалить модель{" "}
            <strong>{deleteConfirm.model?.name}</strong>?
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm({ isOpen: false, model: null })}
            >
              Отменить
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Удалить
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

