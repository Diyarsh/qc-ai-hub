import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  FileText, 
  Cloud, 
  Plus, 
  Search, 
  Eye,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Filter,
  TrendingUp,
  Settings,
  Download
} from "lucide-react";

export interface Dataset {
  id: string;
  name: string;
  source: "sql" | "csv" | "parquet" | "excel" | "s3" | "postgresql" | "json" | "text";
  connection?: string;
  path?: string;
  size?: number;
  rows?: number;
  columns?: number;
  owner?: string;
  status?: "active" | "processing" | "inactive";
  profiling?: {
    types: Record<string, string>;
    missing: Record<string, number>;
    anomalies: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

interface DatasetManagerProps {
  datasets: Dataset[];
  onSelectDataset: (dataset: Dataset) => void;
  onAddDataset: () => void;
}

export function DatasetManager({
  datasets,
  onSelectDataset,
  onAddDataset,
}: DatasetManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDatasets = datasets.filter((ds) =>
    ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ds.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSourceIcon = (source: Dataset["source"]) => {
    switch (source) {
      case "sql":
      case "postgresql":
        return Database;
      case "csv":
      case "parquet":
      case "excel":
        return FileText;
      case "json":
      case "text":
        return FileText;
      case "s3":
        return Cloud;
      default:
        return Database;
    }
  };

  const getSourceTypeLabel = (source: Dataset["source"]) => {
    switch (source) {
      case "sql":
        return "SQL";
      case "postgresql":
        return "PostgreSQL";
      case "csv":
        return "CSV";
      case "parquet":
        return "Parquet";
      case "excel":
        return "Excel";
      case "json":
        return "JSON";
      case "text":
        return "Text";
      case "s3":
        return "S3";
      default:
        return String(source).toUpperCase();
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "active":
        return "Активен";
      case "processing":
        return "Обработка";
      case "inactive":
        return "Неактивен";
      default:
        return "Активен";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  const getSourceColor = (source: Dataset["source"]) => {
    switch (source) {
      case "sql":
        return "bg-blue-500";
      case "csv":
        return "bg-green-500";
      case "parquet":
        return "bg-purple-500";
      case "excel":
        return "bg-yellow-500";
      case "s3":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search and Actions */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск датасетов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Фильтр
          </Button>
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Аналитика
          </Button>
        </div>
      </div>

      {/* Dataset List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredDatasets.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              Датасеты не найдены
            </div>
          ) : (
            filteredDatasets.map((dataset) => {
              const SourceIcon = getSourceIcon(dataset.source);
              return (
                <Card
                  key={dataset.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => onSelectDataset(dataset)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Icon and Title */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className={`p-3 rounded-lg ${getSourceColor(dataset.source)} flex-shrink-0`}>
                          <SourceIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base mb-3">{dataset.name}</h3>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Тип: </span>
                              <span className="font-medium">{getSourceTypeLabel(dataset.source)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Строк: </span>
                              <span className="font-medium">{dataset.rows?.toLocaleString() || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Владелец: </span>
                              <span className="font-medium">{dataset.owner || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Обновлен: </span>
                              <span className="font-medium">{formatDate(dataset.updatedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Status and Actions */}
                      <div className="flex items-start gap-3 flex-shrink-0">
                        <Badge className={`${getStatusColor(dataset.status)} text-xs`}>
                          {getStatusLabel(dataset.status)}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle analytics
                            }}
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectDataset(dataset);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle settings
                            }}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle download
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

