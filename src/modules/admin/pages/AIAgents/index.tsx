import { useState, useMemo } from "react";
import { Pencil, Trash2, Plus, Search, Eye } from "lucide-react";
import { DataTable, Column } from "@/shared/components/Table/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/Forms/Input";
import { Modal } from "@/shared/components/Modal";
import { Badge } from "@/shared/components/Badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/shared/components/Forms/Select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/shared/components/Toast";
import { mockAIAgents, AIAgent, AIAgentType } from "./mockData";
import { mockLLMModels } from "../LLMModels/mockData";

export default function AIAgents() {
  const [agents, setAgents] = useState<AIAgent[]>(mockAIAgents);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<AIAgentType | "">("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null);
  const [viewingAgent, setViewingAgent] = useState<AIAgent | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; agent: AIAgent | null }>({
    isOpen: false,
    agent: null,
  });
  const { showToast } = useToast();

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !typeFilter || agent.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [agents, searchQuery, typeFilter]);

  const handleCreate = () => {
    setEditingAgent(null);
    setIsFormOpen(true);
  };

  const handleEdit = (agent: AIAgent) => {
    setEditingAgent(agent);
    setIsFormOpen(true);
  };

  const handleDelete = (agent: AIAgent) => {
    setDeleteConfirm({ isOpen: true, agent });
  };

  const confirmDelete = () => {
    if (deleteConfirm.agent) {
      setAgents(agents.filter((a) => a.id !== deleteConfirm.agent!.id));
      showToast("Агент удален", "success");
      setDeleteConfirm({ isOpen: false, agent: null });
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const agentData: Partial<AIAgent> & { id?: number } = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as AIAgentType,
      systemPrompt: formData.get("systemPrompt") as string,
      llmModelId: parseInt(formData.get("llmModelId") as string),
      enabled: formData.get("enabled") === "on",
    };

    if (editingAgent) {
      setAgents(
        agents.map((a) =>
          a.id === editingAgent.id ? { ...a, ...agentData, updatedAt: new Date().toISOString() } : a
        ) as AIAgent[]
      );
      showToast("Агент обновлен", "success");
    } else {
      const newAgent: AIAgent = {
        ...agentData,
        id: Math.max(...agents.map((a) => a.id), 0) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as AIAgent;
      setAgents([...agents, newAgent]);
      showToast("Агент создан", "success");
    }
    setIsFormOpen(false);
    setEditingAgent(null);
  };

  const columns: Column<AIAgent>[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Название", sortable: true },
    {
      key: "type",
      label: "Тип",
      render: (_, row) => (
        <Badge
          variant={
            row.type === "CHAT" ? "info" : row.type === "TASK" ? "warning" : "success"
          }
        >
          {row.type}
        </Badge>
      ),
    },
    {
      key: "llmModelId",
      label: "LLM Модель",
      render: (value) => {
        const model = mockLLMModels.find((m) => m.id === value);
        return model ? model.name : `ID: ${value}`;
      },
    },
    {
      key: "enabled",
      label: "Статус",
      render: (_, row) => (
        <Badge variant={row.enabled ? "success" : "error"}>
          {row.enabled ? "Включен" : "Отключен"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI Агенты</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Создать агента
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
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as AIAgentType | "")}
          options={[
            { value: "", label: "Все типы" },
            { value: "CHAT", label: "CHAT" },
            { value: "TASK", label: "TASK" },
            { value: "ANALYSIS", label: "ANALYSIS" },
          ]}
          className="w-48"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredAgents}
        actions={(row) => (
          <>
            <Button variant="ghost" size="icon" onClick={() => setViewingAgent(row)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(row)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(row)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </>
        )}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAgent(null);
        }}
        title={editingAgent ? "Редактировать агента" : "Создать агента"}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Название *"
            name="name"
            defaultValue={editingAgent?.name}
            required
          />
          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={editingAgent?.description}
              rows={2}
            />
          </div>
          <div>
            <Label>Тип *</Label>
            <div className="flex gap-4 mt-2">
              {(["CHAT", "TASK", "ANALYSIS"] as AIAgentType[]).map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    defaultChecked={editingAgent?.type === type}
                    required
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="systemPrompt">System Prompt *</Label>
            <Textarea
              id="systemPrompt"
              name="systemPrompt"
              defaultValue={editingAgent?.systemPrompt}
              rows={6}
              required
            />
          </div>
          <Select
            label="LLM Модель *"
            name="llmModelId"
            defaultValue={editingAgent?.llmModelId.toString()}
            options={mockLLMModels.map((m) => ({
              value: m.id.toString(),
              label: m.name,
            }))}
            required
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="enabled"
              defaultChecked={editingAgent?.enabled ?? true}
            />
            <Label>Включен</Label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsFormOpen(false);
                setEditingAgent(null);
              }}
            >
              Отменить
            </Button>
            <Button type="submit">{editingAgent ? "Сохранить" : "Создать"}</Button>
          </div>
        </form>
      </Modal>

      {viewingAgent && (
        <Modal
          isOpen={!!viewingAgent}
          onClose={() => setViewingAgent(null)}
          title={viewingAgent.name}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Тип</p>
                <Badge>{viewingAgent.type}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Статус</p>
                <Badge variant={viewingAgent.enabled ? "success" : "error"}>
                  {viewingAgent.enabled ? "Включен" : "Отключен"}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Описание</p>
              <p>{viewingAgent.description}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">System Prompt</p>
              <p className="bg-muted/30 p-3 rounded text-sm">{viewingAgent.systemPrompt}</p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setViewingAgent(null)}>
                Закрыть
              </Button>
              <Button onClick={() => {
                setViewingAgent(null);
                handleEdit(viewingAgent);
              }}>
                <Pencil className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <Modal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, agent: null })}
        title="Подтверждение удаления"
        size="sm"
      >
        <div className="space-y-4">
          <p>
            Вы уверены, что хотите удалить агента{" "}
            <strong>{deleteConfirm.agent?.name}</strong>?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteConfirm({ isOpen: false, agent: null })}>
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

