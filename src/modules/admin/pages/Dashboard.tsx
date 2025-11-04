import { useState } from "react";
import { StatCard } from "../components/StatCard";
import { BarChart3, Brain, Database, Users, Server, Plus, RefreshCw, Upload, Clock, UserPlus, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/shared/components/Badge";
import { useToast } from "@/shared/components/Toast";
import { mockAIAgents } from "./AIAgents/mockData";
import { mockLLMModels } from "./LLMModels/mockData";

interface ServiceStatus {
  name: string;
  status: string;
  uptime?: string;
}

const mockServices: ServiceStatus[] = [
  { name: "Consul", status: "UP", uptime: "99.97%" },
  { name: "Database", status: "UP", uptime: "99.99%" },
  { name: "agentservice", status: "UP", uptime: "99.95%" },
  { name: "documentservice", status: "UP", uptime: "99.92%" },
  { name: "chatservice", status: "UP", uptime: "99.98%" },
  { name: "llmrouter", status: "UP", uptime: "99.94%" },
  { name: "semanticcontextservice", status: "WARNING", uptime: "98.5%" },
];

interface Activity {
  id: number;
  type: "create" | "update" | "delete" | "system";
  entity: string;
  message: string;
  time: string;
}

const mockActivities: Activity[] = [
  { id: 1, type: "create", entity: "User", message: "Создан пользователь john.doe", time: "2 минуты назад" },
  { id: 2, type: "update", entity: "LLM Model", message: "Обновлена модель GPT-4 Turbo", time: "15 минут назад" },
  { id: 3, type: "create", entity: "AI Agent", message: "Создан агент Customer Support", time: "1 час назад" },
  { id: 4, type: "delete", entity: "Knowledge", message: "Удален документ Old Manual", time: "2 часа назад" },
  { id: 5, type: "system", entity: "System", message: "Обновление конфигурации выполнено", time: "3 часа назад" },
  { id: 6, type: "update", entity: "User", message: "Изменены роли пользователя admin", time: "5 часов назад" },
  { id: 7, type: "create", entity: "LLM Model", message: "Добавлена модель DeepSeek Chat", time: "1 день назад" },
  { id: 8, type: "update", entity: "AI Agent", message: "Обновлен system prompt агента Code Assistant", time: "1 день назад" },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "create":
      return <Plus className="h-4 w-4 text-green-500" />;
    case "update":
      return <Settings className="h-4 w-4 text-blue-500" />;
    case "delete":
      return <Trash2 className="h-4 w-4 text-red-500" />;
    default:
      return <RefreshCw className="h-4 w-4 text-orange-500" />;
  }
};

export default function Dashboard() {
  const { showToast } = useToast();
  const agents = mockAIAgents.length;
  const models = mockLLMModels.length;
  const knowledge = 12;
  const uptime = "720 ч";

  const handleQuickAction = (action: string) => {
    showToast(`Действие "${action}" выполнено`, "success");
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="AI-агенты" value={agents} icon={Brain} color="blue" />
        <StatCard label="LLM-модели" value={models} icon={Database} color="green" />
        <StatCard label="База знаний" value={knowledge} icon={Users} color="orange" />
        <StatCard label="Аптайм" value={uptime} icon={BarChart3} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border">
          <h2 className="font-semibold mb-4 text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-auto flex-col py-4 bg-card hover:bg-muted"
              onClick={() => handleQuickAction("Create Agent")}
            >
              <Plus className="h-5 w-5 mb-2 text-foreground" />
              <span className="text-xs text-foreground">Create Agent</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col py-4 bg-card hover:bg-muted"
              onClick={() => handleQuickAction("Add Model")}
            >
              <Database className="h-5 w-5 mb-2 text-foreground" />
              <span className="text-xs text-foreground">Add Model</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col py-4 bg-card hover:bg-muted"
              onClick={() => handleQuickAction("Upload Document")}
            >
              <Upload className="h-5 w-5 mb-2 text-foreground" />
              <span className="text-xs text-foreground">Upload Document</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col py-4 bg-card hover:bg-muted"
              onClick={() => handleQuickAction("Refresh Cache")}
            >
              <RefreshCw className="h-5 w-5 mb-2 text-foreground" />
              <span className="text-xs text-foreground">Refresh Cache</span>
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h2 className="font-semibold mb-4 text-foreground">Recent Activity</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50">
                <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="default" className="text-xs">
                      {activity.entity}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-card border-border">
        <h2 className="font-semibold mb-4 text-foreground">Статус сервисов</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockServices.map((service) => (
            <div key={service.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
              <Server className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground">{service.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={service.status === "UP" ? "success" : service.status === "DOWN" ? "error" : "warning"}
                    className="text-xs"
                  >
                    {service.status}
                  </Badge>
                  {service.uptime && (
                    <span className="text-xs text-muted-foreground">{service.uptime}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
