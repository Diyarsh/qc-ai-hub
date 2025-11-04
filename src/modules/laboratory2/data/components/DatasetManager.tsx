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
  CheckCircle2
} from "lucide-react";

export interface Dataset {
  id: string;
  name: string;
  source: "sql" | "csv" | "parquet" | "excel" | "s3";
  connection?: string;
  path?: string;
  size?: number;
  rows?: number;
  columns?: number;
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
        return Database;
      case "csv":
      case "parquet":
      case "excel":
        return FileText;
      case "s3":
        return Cloud;
      default:
        return Database;
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
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">Datasets</h3>
          <p className="text-xs text-muted-foreground">
            Manage your data sources
          </p>
        </div>
        <Button size="sm" onClick={onAddDataset}>
          <Plus className="h-4 w-4 mr-2" />
          Add Dataset
        </Button>
      </div>

      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search datasets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredDatasets.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              No datasets found
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
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${getSourceColor(dataset.source)}`}
                        >
                          <SourceIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm">{dataset.name}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {dataset.source.toUpperCase()}
                            {dataset.path && ` • ${dataset.path}`}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {dataset.rows?.toLocaleString() || "N/A"} rows
                      </Badge>
                    </div>
                  </CardHeader>
                  {dataset.profiling && (
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          {dataset.columns || "N/A"} columns
                        </div>
                        {dataset.profiling.anomalies.length > 0 && (
                          <div className="flex items-center gap-1 text-yellow-600">
                            <AlertCircle className="h-3 w-3" />
                            {dataset.profiling.anomalies.length} anomalies
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

