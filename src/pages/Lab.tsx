import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Plus, Search, Filter, Settings, Play, BarChart3, FileText, Database, Clock, AlertTriangle, Zap, Activity, Download, Eye, MoreHorizontal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useDeveloperMode } from "@/contexts/DeveloperModeContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Lab() {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { isDeveloperMode } = useDeveloperMode();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("agents");

  useEffect(() => {
    if (!isDeveloperMode) {
      navigate('/dashboard');
    }
  }, [isDeveloperMode, navigate]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">{t('sidebar.lab')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">{t('sidebar.lab')}</h2>
            <p className="text-muted-foreground">Создание и управление AI агентами и моделями</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="agents">Агенты</TabsTrigger>
              <TabsTrigger value="data">Данные</TabsTrigger>
              <TabsTrigger value="catalog">Каталог</TabsTrigger>
              <TabsTrigger value="monitoring">Мониторинг</TabsTrigger>
              <TabsTrigger value="documentation">Документация</TabsTrigger>
            </TabsList>

            <TabsContent value="agents" className="mt-6">
              <div className="flex gap-4 h-[600px]">
                {/* Left Sidebar - Node Library */}
                <div className="w-80 bg-card border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Библиотека узлов</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Создать флоу
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">ТРИГГЕРЫ</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer">
                          <Zap className="h-4 w-4" />
                          <span className="text-sm">Webhook</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer">
                          <Play className="h-4 w-4" />
                          <span className="text-sm">Расписание</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">LLM / CHAT</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">Chat GPT</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">Claude</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">KNOWLEDGE</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer">
                          <Search className="h-4 w-4" />
                          <span className="text-sm">RAG Search</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">Document</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">TOOLS</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer">
                          <Database className="h-4 w-4" />
                          <span className="text-sm">HTTP</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer">
                          <Database className="h-4 w-4" />
                          <span className="text-sm">SQL</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">БЕЗОПАСНОСТЬ</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm">Guardrails</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Canvas */}
                <div className="flex-1 bg-card border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Canvas</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="h-full min-h-[400px] border-2 border-dashed border-muted rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <FlaskConical className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Перетащите узлы для создания флоу</p>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar - Settings */}
                <div className="w-80 bg-card border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Настройки узла</h3>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center text-muted-foreground">
                    <p className="text-sm">Выберите узел для настройки</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Данные</h3>
                    <p className="text-muted-foreground">Управление данными и AutoML</p>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Подключить источник
                  </Button>
                </div>

                <Tabs defaultValue="datasets" className="w-full">
                  <TabsList>
                    <TabsTrigger value="datasets">Датасеты</TabsTrigger>
                    <TabsTrigger value="automl">AutoML</TabsTrigger>
                    <TabsTrigger value="transformation">Трансформация</TabsTrigger>
                  </TabsList>

                  <TabsContent value="datasets" className="mt-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative flex-1">
                        <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                        <Input placeholder="Поиск датасетов..." className="pl-9" />
                      </div>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Фильтр
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Database className="h-8 w-8 text-blue-500" />
                              <div>
                                <h4 className="font-medium">Продажи 2024</h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>Тип: CSV</span>
                                  <span>Строк: 50,000</span>
                                  <span>Владелец: Аналитик</span>
                                  <span>Обновлен: 15/01/2024</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">Активен</Badge>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Database className="h-8 w-8 text-green-500" />
                              <div>
                                <h4 className="font-medium">Клиентская база</h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>Тип: PostgreSQL</span>
                                  <span>Строк: 120,000</span>
                                  <span>Владелец: ML Team</span>
                                  <span>Обновлен: 14/01/2024</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">Активен</Badge>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Database className="h-8 w-8 text-orange-500" />
                              <div>
                                <h4 className="font-medium">Веб-логи</h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>Тип: JSON</span>
                                  <span>Строк: 1,500,000</span>
                                  <span>Владелец: DevOps</span>
                                  <span>Обновлен: 13/01/2024</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Обработка</Badge>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            <TabsContent value="catalog" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Каталог</h3>
                    <p className="text-muted-foreground">Готовые флоу и модели для быстрого старта</p>
                  </div>
                </div>

                <Tabs defaultValue="all" className="w-full">
                  <div className="flex items-center justify-between">
                    <TabsList>
                      <TabsTrigger value="all">Все</TabsTrigger>
                      <TabsTrigger value="flows">Флоу</TabsTrigger>
                      <TabsTrigger value="models">Модели</TabsTrigger>
                    </TabsList>
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input placeholder="Поиск в каталоге..." className="pl-9 w-64" />
                    </div>
                  </div>

                  <TabsContent value="all" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <FileText className="h-8 w-8 text-blue-500" />
                            <Badge>Флоу</Badge>
                          </div>
                          <CardTitle className="text-lg">FAQ-бот по документам</CardTitle>
                          <CardDescription>
                            Автоматический бот для ответов на вопросы по корпоративным документам с использованием RAG
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Вход:</span>
                              <span className="text-muted-foreground">Текст вопроса</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Выход:</span>
                              <span className="text-muted-foreground">Ответ с источниками</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2 text-sm">
                              <span>⭐ 4.8</span>
                              <span className="text-muted-foreground">1250</span>
                            </div>
                            <Button size="sm">Установить</Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <Database className="h-8 w-8 text-green-500" />
                            <Badge>Флоу</Badge>
                          </div>
                          <CardTitle className="text-lg">Data-assistant для SQL</CardTitle>
                          <CardDescription>
                            Помощник для создания SQL запросов и анализа данных на естественном языке
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Вход:</span>
                              <span className="text-muted-foreground">Вопрос на естественном языке</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Выход:</span>
                              <span className="text-muted-foreground">SQL запрос + результат</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2 text-sm">
                              <span>⭐ 4.6</span>
                              <span className="text-muted-foreground">890</span>
                            </div>
                            <Button size="sm">Установить</Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <BarChart3 className="h-8 w-8 text-purple-500" />
                            <Badge variant="secondary">Модель</Badge>
                          </div>
                          <CardTitle className="text-lg">Прогноз спроса</CardTitle>
                          <CardDescription>
                            Модель для прогнозирования спроса на товары на основе исторических данных
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Вход:</span>
                              <span className="text-muted-foreground">Исторические данные продаж</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Выход:</span>
                              <span className="text-muted-foreground">Прогноз спроса</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2 text-sm">
                              <span>⭐ 4.7</span>
                              <span className="text-muted-foreground">650</span>
                            </div>
                            <Button size="sm">Установить</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Мониторинг</h3>
                    <p className="text-muted-foreground">Отслеживание производительности агентов и моделей</p>
                  </div>
                </div>

                <Tabs defaultValue="agents" className="w-full">
                  <TabsList>
                    <TabsTrigger value="agents">Агенты</TabsTrigger>
                    <TabsTrigger value="models">Модели</TabsTrigger>
                    <TabsTrigger value="costs">Стоимость</TabsTrigger>
                  </TabsList>

                  <TabsContent value="agents" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-green-500" />
                            <span className="font-medium">Активные агенты</span>
                          </div>
                          <div className="text-2xl font-bold mt-2">2</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-500" />
                            <span className="font-medium">Среднее время ответа</span>
                          </div>
                          <div className="text-2xl font-bold mt-2">667ms</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <span className="font-medium">Общая ошибок %</span>
                          </div>
                          <div className="text-2xl font-bold mt-2">34.5%</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-purple-500" />
                            <span className="font-medium">Всего токенов</span>
                          </div>
                          <div className="text-2xl font-bold mt-2">77K</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Детали по агентам</h4>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <div>
                                <h5 className="font-medium">FAQ Bot</h5>
                                <div className="text-sm text-muted-foreground">
                                  Время ответа: 1200ms • Ошибки: 2.1% • Токены: 45,000 • Последняя активность: 14:30:00
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary">Активен</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <div>
                                <h5 className="font-medium">SQL Assistant</h5>
                                <div className="text-sm text-muted-foreground">
                                  Время ответа: 800ms • Ошибки: 1.5% • Токены: 32,000 • Последняя активность: 14:25:00
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary">Активен</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <div>
                                <h5 className="font-medium">Content Generator</h5>
                                <div className="text-sm text-muted-foreground">
                                  Время ответа: 0ms • Ошибки: 100% • Токены: 0 • Последняя активность: 12:15:00
                                </div>
                              </div>
                            </div>
                            <Badge variant="destructive">Ошибка</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            <TabsContent value="documentation" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold">Документация</h3>
                  <p className="text-muted-foreground">Руководства и справочные материалы</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <FileText className="h-8 w-8 text-blue-500 mb-4" />
                      <h4 className="font-medium mb-2">Начало работы</h4>
                      <p className="text-sm text-muted-foreground">Основы создания и настройки AI агентов</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <Settings className="h-8 w-8 text-green-500 mb-4" />
                      <h4 className="font-medium mb-2">API Reference</h4>
                      <p className="text-sm text-muted-foreground">Полная документация по API</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <BarChart3 className="h-8 w-8 text-purple-500 mb-4" />
                      <h4 className="font-medium mb-2">Примеры использования</h4>
                      <p className="text-sm text-muted-foreground">Практические кейсы и решения</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}