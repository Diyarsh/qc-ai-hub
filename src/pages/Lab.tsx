import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Database, Eye, Settings, Download, Filter, BarChart3, TrendingUp, Activity, AlertTriangle } from "lucide-react";

export default function Lab() {
  const [activeTab, setActiveTab] = useState("ml-studio");

  const datasets = [
    {
      name: "Продажи 2024",
      status: "Активен",
      type: "CSV",
      rows: "50,000",
      owner: "Аналитик",
      updated: "1/14/2024"
    },
    {
      name: "Клиентская база",
      status: "Активен",
      type: "PostgreSQL",
      rows: "120,000",
      owner: "ML Team",
      updated: "1/13/2024"
    },
    {
      name: "Веб-логи",
      status: "Обработка",
      type: "JSON",
      rows: "1,500,000",
      owner: "DevOps",
      updated: "1/12/2024"
    }
  ];

  const metrics = [
    { label: "Активные модели", value: "2", icon: BarChart3, color: "text-blue-500" },
    { label: "Средний AUC", value: "0.95", icon: TrendingUp, color: "text-green-500" },
    { label: "Всего предсказаний", value: "23K", icon: Activity, color: "text-purple-500" },
    { label: "Дрейф признаков", value: "1", icon: AlertTriangle, color: "text-yellow-500" }
  ];

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader 
        title="Лаборатория"
        subtitle="Создание и управление AI агентами и моделями"
      />
      
      <div className="container mx-auto p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="ml-studio">ML-Studio</TabsTrigger>
            <TabsTrigger value="agents-studio">Agents-Studio</TabsTrigger>
          </TabsList>

          <TabsContent value="ml-studio" className="space-y-6 mt-6">
            {/* Data Management Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Данные</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Управление данными и AutoML</p>
                </div>
                <Button className="bg-cyan-500 hover:bg-cyan-600">
                  <span className="mr-2">+</span> Подключить источник
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="datasets" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="datasets">Датасеты</TabsTrigger>
                    <TabsTrigger value="automl">AutoML</TabsTrigger>
                    <TabsTrigger value="transformation">Трансформация</TabsTrigger>
                  </TabsList>

                  <TabsContent value="datasets" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="relative flex-1 max-w-md">
                        <Input 
                          placeholder="Поиск датасетов..." 
                          className="pl-10"
                        />
                        <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                      <Button variant="outline" className="ml-4">
                        <Filter className="w-4 h-4 mr-2" />
                        Фильтр
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {datasets.map((dataset, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <Database className="w-5 h-5 text-cyan-500" />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{dataset.name}</h4>
                                <Badge 
                                  variant={dataset.status === "Активен" ? "default" : "secondary"}
                                  className={dataset.status === "Активен" ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" : "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"}
                                >
                                  {dataset.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Тип: {dataset.type} • Строк: {dataset.rows} • Владелец: {dataset.owner} • Обновлен: {dataset.updated}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="automl">
                    <div className="text-center py-12 text-muted-foreground">
                      AutoML функции в разработке
                    </div>
                  </TabsContent>

                  <TabsContent value="transformation">
                    <div className="text-center py-12 text-muted-foreground">
                      Инструменты трансформации данных в разработке
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Model Monitoring Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Мониторинг моделей</CardTitle>
                <p className="text-sm text-muted-foreground">Отслеживание производительности ML моделей</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <Card key={index} className="bg-card/50">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">{metric.label}</p>
                            <Icon className={`w-5 h-5 ${metric.color}`} />
                          </div>
                          <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents-studio" className="mt-6">
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                Agents-Studio в разработке
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
