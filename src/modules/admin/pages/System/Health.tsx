import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/shared/components/Badge";
import { Card } from "@/components/ui/card";

interface HealthStatus {
  name: string;
  status: "UP" | "DOWN" | "WARNING";
  details?: string;
}

const mockHealth: HealthStatus[] = [
  { name: "Consul", status: "UP", details: "Uptime: 15d 3h" },
  { name: "Database PostgreSQL", status: "UP", details: "Connections: 12/100" },
  { name: "Disk Space", status: "UP", details: "Used: 45% (450GB / 1TB)" },
  { name: "agentservice", status: "UP", details: "Version: 1.2.0" },
  { name: "documentservice", status: "UP", details: "Version: 1.1.5" },
  { name: "chatservice", status: "UP", details: "Version: 1.3.0" },
  { name: "llmrouter", status: "UP", details: "Version: 1.0.8" },
  { name: "semanticcontextservice", status: "WARNING", details: "High memory usage: 85%" },
];

export function Health() {
  const [health, setHealth] = useState<HealthStatus[]>(mockHealth);

  useEffect(() => {
    const interval = setInterval(() => {
      // Симуляция обновления данных
      setHealth([...mockHealth]);
    }, 30000); // 30 секунд
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "UP":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "DOWN":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "WARNING":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {health.map((item) => (
        <Card key={item.name} className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium">{item.name}</h3>
            {getStatusIcon(item.status)}
          </div>
          <Badge
            variant={
              item.status === "UP" ? "success" : item.status === "DOWN" ? "error" : "warning"
            }
            className="mb-2"
          >
            {item.status}
          </Badge>
          {item.details && (
            <p className="text-sm text-muted-foreground mt-2">{item.details}</p>
          )}
        </Card>
      ))}
    </div>
  );
}

