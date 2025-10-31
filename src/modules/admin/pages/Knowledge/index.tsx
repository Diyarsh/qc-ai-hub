import { useState, useMemo } from "react";
import { Pencil, Trash2, Plus, Search, Eye, Upload } from "lucide-react";
import { DataTable, Column } from "@/shared/components/Table/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/Forms/Input";
import { Select } from "@/shared/components/Forms/Select";
import { Modal } from "@/shared/components/Modal";
import { Badge } from "@/shared/components/Badge";
import { FileUpload } from "@/shared/components/Forms/FileUpload";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/shared/components/Toast";

export type KnowledgeSourceType = "FILE" | "MANUAL_TEXT" | "URL";
export type KnowledgeStatus = "PROCESSING" | "READY" | "FAILED";

export interface Knowledge {
  id: number;
  name: string;
  description: string;
  status: KnowledgeStatus;
  sourceType: KnowledgeSourceType;
  storagePath: string;
  statusMessage?: string;
  agentId: number;
  createdAt: string;
  updatedAt: string;
}

const mockKnowledge: Knowledge[] = [
  {
    id: 1,
    name: "Product Documentation",
    description: "Полная документация по продукту",
    status: "READY",
    sourceType: "FILE",
    storagePath: "/docs/product.pdf",
    agentId: 1,
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:15:00Z",
  },
  {
    id: 2,
    name: "API Reference",
    description: "Справочник API",
    status: "READY",
    sourceType: "FILE",
    storagePath: "/docs/api.docx",
    agentId: 1,
    createdAt: "2024-01-22T14:30:00Z",
    updatedAt: "2024-01-22T14:45:00Z",
  },
  {
    id: 3,
    name: "Customer FAQs",
    description: "Часто задаваемые вопросы",
    status: "PROCESSING",
    sourceType: "MANUAL_TEXT",
    storagePath: "",
    statusMessage: "Обработка... 45%",
    agentId: 2,
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-02-01T09:00:00Z",
  },
  {
    id: 4,
    name: "Company Website",
    description: "Контент с корпоративного сайта",
    status: "READY",
    sourceType: "URL",
    storagePath: "https://example.com",
    agentId: 3,
    createdAt: "2024-02-05T11:20:00Z",
    updatedAt: "2024-02-05T11:35:00Z",
  },
  {
    id: 5,
    name: "Technical Manual",
    description: "Техническое руководство",
    status: "FAILED",
    sourceType: "FILE",
    storagePath: "/docs/manual.pdf",
    statusMessage: "Ошибка парсинга PDF",
    agentId: 2,
    createdAt: "2024-02-10T15:00:00Z",
    updatedAt: "2024-02-10T15:10:00Z",
  },
];

export default function Knowledge() {
  const [knowledge, setKnowledge] = useState<Knowledge[]>(mockKnowledge);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<KnowledgeStatus | "">("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToast();

  const filteredKnowledge = useMemo(() => {
    return knowledge.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [knowledge, searchQuery, statusFilter]);

  const handleUpload = (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          const newItem: Knowledge = {
            id: Math.max(...knowledge.map((k) => k.id), 0) + 1,
            name: files[0].name,
            description: "",
            status: "PROCESSING",
            sourceType: "FILE",
            storagePath: `/uploads/${files[0].name}`,
            agentId: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setKnowledge([...knowledge, newItem]);
          showToast("Файл загружен, идет обработка", "success");
          setIsUploadOpen(false);
          setTimeout(() => {
            setKnowledge((prev) =>
              prev.map((k) =>
                k.id === newItem.id
                  ? { ...k, status: "READY", statusMessage: undefined }
                  : k
              )
            );
          }, 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const columns: Column<Knowledge>[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Название", sortable: true },
    {
      key: "sourceType",
      label: "Тип источника",
      render: (_, row) => (
        <Badge variant={row.sourceType === "FILE" ? "info" : row.sourceType === "URL" ? "warning" : "default"}>
          {row.sourceType}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Статус",
      render: (_, row) => (
        <Badge
          variant={
            row.status === "READY"
              ? "success"
              : row.status === "PROCESSING"
              ? "warning"
              : "error"
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: "agentId",
      label: "Агент",
      render: (value) => `Agent #${value}`,
    },
    {
      key: "createdAt",
      label: "Создан",
      render: (value) => new Date(value as string).toLocaleDateString("ru-RU"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">База знаний</h1>
        <Button onClick={() => setIsUploadOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Загрузить документ
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as KnowledgeStatus | "")}
          options={[
            { value: "", label: "Все статусы" },
            { value: "PROCESSING", label: "PROCESSING" },
            { value: "READY", label: "READY" },
            { value: "FAILED", label: "FAILED" },
          ]}
          className="w-48"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredKnowledge}
        actions={(row) => (
          <>
            <Button variant="ghost" size="icon" onClick={() => showToast("Предпросмотр", "info")}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => showToast("Удаление не реализовано", "warning")}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </>
        )}
      />

      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Загрузка документа"
        size="lg"
      >
        <div className="space-y-4">
          <FileUpload onFilesSelected={handleUpload} />
          {isUploading && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Загрузка и обработка...</p>
              <Progress value={uploadProgress} />
              <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

