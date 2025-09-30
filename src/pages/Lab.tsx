import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FlaskConical, Plus, Search, Filter, Settings, Play, BarChart3, FileText, Database, Clock, AlertTriangle, Zap, Activity, Download, Eye, MoreHorizontal, Brain, MessageSquare, Upload, Mail, Shield, ChevronDown, ChevronRight, Workflow, Code, Bot, TestTube, Users, Gauge, BookOpen, Star, TrendingUp, AlertCircle, CheckCircle2, XCircle, CalendarDays, Globe, Slack, Github, RotateCcw, Maximize2, ZoomIn, ZoomOut, Terminal, Bug, MapPin, Layers, Share2, Palette, Network, Sparkles, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useDeveloperMode } from "@/contexts/DeveloperModeContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Lab() {
  const {
    t
  } = useLanguage();
  const {
    theme,
    setTheme
  } = useTheme();
  const {
    isDeveloperMode
  } = useDeveloperMode();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("agents");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    triggers: true,
    llm: true,
    knowledge: false,
    tools: false,
    memory: false,
    guardrails: false,
    eval: false,
    actions: false
  });
  const [showDebugConsole, setShowDebugConsole] = useState(false);
  const [debugTab, setDebugTab] = useState("logs");

  // Remove the developer mode restriction - Laboratory is now accessible to all users
  // useEffect(() => {
  //   if (!isDeveloperMode) {
  //     navigate('/dashboard');
  //   }
  // }, [isDeveloperMode, navigate]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  const nodeCategories = [{
    key: 'triggers',
    title: 'ТРИГГЕРЫ',
    nodes: [{
      icon: Zap,
      name: 'Webhook',
      description: 'HTTP триггер'
    }, {
      icon: CalendarDays,
      name: 'Расписание',
      description: 'Cron триггер'
    }, {
      icon: Slack,
      name: 'Slack Events',
      description: 'События Slack'
    }, {
      icon: Upload,
      name: 'File Upload',
      description: 'Загрузка файла'
    }, {
      icon: Bot,
      name: 'Dashboard Button',
      description: 'Кнопка дашборда'
    }]
  }, {
    key: 'llm',
    title: 'LLM / CHAT',
    nodes: [{
      icon: MessageSquare,
      name: 'Chat GPT',
      description: 'OpenAI модель'
    }, {
      icon: MessageSquare,
      name: 'Claude',
      description: 'Anthropic модель'
    }, {
      icon: Brain,
      name: 'Gemini',
      description: 'Google модель'
    }, {
      icon: Code,
      name: 'System Prompt',
      description: 'Системный промпт'
    }, {
      icon: TestTube,
      name: 'Few-shot',
      description: 'Примеры'
    }]
  }, {
    key: 'knowledge',
    title: 'ЗНАНИЯ',
    nodes: [{
      icon: Search,
      name: 'RAG Search',
      description: 'Поиск по базе'
    }, {
      icon: Database,
      name: 'Vector DB',
      description: 'Векторная БД'
    }, {
      icon: FileText,
      name: 'Document',
      description: 'Документы'
    }, {
      icon: Globe,
      name: 'Web Scraper',
      description: 'Веб парсер'
    }, {
      icon: Sparkles,
      name: 'Embeddings',
      description: 'Векторизация'
    }]
  }, {
    key: 'tools',
    title: 'ИНСТРУМЕНТЫ',
    nodes: [{
      icon: Network,
      name: 'HTTP Request',
      description: 'API запрос'
    }, {
      icon: Database,
      name: 'SQL Query',
      description: 'SQL запрос'
    }, {
      icon: Code,
      name: 'Python Script',
      description: 'Python код'
    }, {
      icon: Mail,
      name: 'Email',
      description: 'Отправка почты'
    }, {
      icon: Github,
      name: 'Git Actions',
      description: 'Git операции'
    }]
  }, {
    key: 'memory',
    title: 'ПАМЯТЬ',
    nodes: [{
      icon: Brain,
      name: 'Short Memory',
      description: 'Краткосрочная'
    }, {
      icon: Database,
      name: 'Long Memory',
      description: 'Долгосрочная'
    }, {
      icon: Users,
      name: 'Session Store',
      description: 'Сессия'
    }]
  }, {
    key: 'guardrails',
    title: 'БЕЗОПАСНОСТЬ',
    nodes: [{
      icon: Shield,
      name: 'PII Masking',
      description: 'Маскировка данных'
    }, {
      icon: AlertTriangle,
      name: 'Content Filter',
      description: 'Фильтр контента'
    }, {
      icon: Lock,
      name: 'Rate Limits',
      description: 'Лимиты запросов'
    }]
  }, {
    key: 'eval',
    title: 'МОНИТОРИНГ',
    nodes: [{
      icon: Activity,
      name: 'Logging',
      description: 'Логирование'
    }, {
      icon: BarChart3,
      name: 'Metrics',
      description: 'Метрики'
    }, {
      icon: Star,
      name: 'Feedback',
      description: 'Обратная связь'
    }]
  }, {
    key: 'actions',
    title: 'ДЕЙСТВИЯ',
    nodes: [{
      icon: Globe,
      name: 'REST API',
      description: 'REST эндпоинт'
    }, {
      icon: MessageSquare,
      name: 'Chat Widget',
      description: 'Виджет чата'
    }, {
      icon: Slack,
      name: 'Slack Bot',
      description: 'Slack бот'
    }, {
      icon: Share2,
      name: 'Webhook Out',
      description: 'Исходящий вебхук'
    }]
  }];
  return <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">{t('sidebar.lab')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
              <TabsTrigger value="data">ML-Studio</TabsTrigger>
              <TabsTrigger value="catalog">Каталог</TabsTrigger>
              <TabsTrigger value="monitoring">Мониторинг</TabsTrigger>
              <TabsTrigger value="documentation">Документация</TabsTrigger>
            </TabsList>

            <TabsContent value="agents" className="mt-6">
              <div className="flex flex-col gap-4 h-[700px]">
                <div className="flex gap-4 flex-1">
                  {/* Left Sidebar - Node Library */}
                  <div className="w-80 bg-card border rounded-lg overflow-hidden flex flex-col">
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Библиотека узлов</h3>
                        <Button size="sm" className="bg-primary">
                          <Plus className="h-4 w-4 mr-2" />
                          Создать флоу
                        </Button>
                      </div>
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                        <Input placeholder="Поиск узлов..." className="pl-9 h-8" />
                      </div>
                    </div>
                    
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-3">
                        {nodeCategories.map(category => <div key={category.key}>
                            <button onClick={() => toggleCategory(category.key)} className="flex items-center gap-2 w-full text-left p-2 rounded">
                              {expandedCategories[category.key] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                {category.title}
                              </span>
                            </button>
                            
                            {expandedCategories[category.key] && <div className="ml-5 space-y-1">
                                {category.nodes.map((node, index) => <div key={index} className="flex items-center gap-3 p-2 rounded cursor-grab active:cursor-grabbing group" draggable>
                                    <node.icon className="h-4 w-4 text-primary flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium text-foreground">
                                        {node.name}
                                      </div>
                                      <div className="text-xs text-muted-foreground truncate">
                                        {node.description}
                                      </div>
                                    </div>
                                  </div>)}
                              </div>}
                          </div>)}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Center Canvas */}
                  <div className="flex-1 bg-card border rounded-lg overflow-hidden flex flex-col">
                    <div className="p-4 border-b bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">Визуальный редактор</h3>
                          <Badge variant="secondary" className="text-xs">
                            Нет активных узлов
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" title="Сохранить">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" title="Масштаб">
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" title="По размеру">
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" title="Отладка" onClick={() => setShowDebugConsole(!showDebugConsole)}>
                            <Terminal className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="bg-green-600">
                            <Play className="h-4 w-4 mr-2" />
                            Запустить
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 relative bg-gradient-to-br from-background to-muted/20">
                      {/* Grid pattern */}
                      <div className="absolute inset-0 opacity-30" style={{
                      backgroundImage: `
                            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                          `,
                      backgroundSize: '20px 20px'
                    }} />
                      
                      {/* Empty state */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                            <Workflow className="h-8 w-8 text-primary" />
                          </div>
                          <h4 className="text-lg font-semibold mb-2">Создайте свой первый флоу</h4>
                          <p className="text-muted-foreground mb-4 max-w-md">
                            Перетащите узлы из библиотеки слева или выберите готовый шаблон
                          </p>
                          <div className="flex gap-2 justify-center">
                            <Button variant="outline" size="sm">
                              <Palette className="h-4 w-4 mr-2" />
                              Шаблоны
                            </Button>
                            <Button size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Начать с пустого
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Sidebar - Node Settings */}
                  <div className="w-80 bg-card border rounded-lg overflow-hidden flex flex-col">
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">
                          {selectedNode ? 'Настройки узла' : 'Свойства'}
                        </h3>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-4">
                      {selectedNode ? <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Название узла</label>
                            <Input value={selectedNode} className="mt-1" />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Описание</label>
                            <Textarea placeholder="Опишите функцию узла..." className="mt-1" rows={3} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Параметры</label>
                            <div className="mt-2 space-y-2">
                              <Input placeholder="Ключ" />
                              <Input placeholder="Значение" />
                            </div>
                          </div>
                        </div> : <div className="text-center text-muted-foreground">
                          <MapPin className="h-8 w-8 mx-auto mb-3 opacity-50" />
                          <p className="text-sm">Выберите узел на холсте для настройки его параметров</p>
                        </div>}
                    </div>
                  </div>
                </div>

                {/* Debug Console (collapsible) */}
                {showDebugConsole && <div className="h-48 bg-card border rounded-lg overflow-hidden flex flex-col">
                    <div className="p-3 border-b bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">Консоль отладки</h4>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-muted-foreground">Активна</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setShowDebugConsole(false)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant={debugTab === "logs" ? "secondary" : "ghost"} size="sm" onClick={() => setDebugTab("logs")}>
                          <FileText className="h-3 w-3 mr-1" />
                          Логи
                        </Button>
                        <Button variant={debugTab === "context" ? "secondary" : "ghost"} size="sm" onClick={() => setDebugTab("context")}>
                          <Database className="h-3 w-3 mr-1" />
                          Контекст
                        </Button>
                        <Button variant={debugTab === "errors" ? "secondary" : "ghost"} size="sm" onClick={() => setDebugTab("errors")}>
                          <Bug className="h-3 w-3 mr-1" />
                          Ошибки
                        </Button>
                      </div>
                    </div>
                    
                    <ScrollArea className="flex-1 p-3">
                      {debugTab === "logs" && <div className="space-y-2 font-mono text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="text-xs">12:34:56</span>
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span>Флоу инициализирован</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="text-xs">12:34:57</span>
                            <AlertCircle className="h-3 w-3 text-yellow-500" />
                            <span>Ожидание входных данных...</span>
                          </div>
                        </div>}
                      {debugTab === "context" && <div className="text-sm text-muted-foreground">
                          <p>Контекст выполнения будет отображаться здесь</p>
                        </div>}
                      {debugTab === "errors" && <div className="text-sm text-muted-foreground">
                          <p>Ошибки будут отображаться здесь</p>
                        </div>}
                    </ScrollArea>
                  </div>}
              </div>
            </TabsContent>

            <TabsContent value="data" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Данные и AutoML</h3>
                    <p className="text-muted-foreground">Управление данными, трансформация и автоматическое машинное обучение</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Загрузить файл
                    </Button>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Подключить источник
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="datasets" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="datasets">Датасеты</TabsTrigger>
                    <TabsTrigger value="transformation">Трансформация</TabsTrigger>
                    <TabsTrigger value="automl">AutoML</TabsTrigger>
                    <TabsTrigger value="models">Модели</TabsTrigger>
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
                      <Button variant="outline">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Аналитика
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {[{
                      name: "Продажи 2024",
                      type: "CSV",
                      rows: "50,000",
                      owner: "Аналитик",
                      updated: "15/01/2024",
                      status: "Активен",
                      color: "blue"
                    }, {
                      name: "Клиентская база",
                      type: "PostgreSQL",
                      rows: "120,000",
                      owner: "ML Team",
                      updated: "14/01/2024",
                      status: "Активен",
                      color: "green"
                    }, {
                      name: "Веб-логи",
                      type: "JSON",
                      rows: "1,500,000",
                      owner: "DevOps",
                      updated: "13/01/2024",
                      status: "Обработка",
                      color: "orange"
                    }, {
                      name: "Отзывы клиентов",
                      type: "Text",
                      rows: "25,000",
                      owner: "Маркетинг",
                      updated: "12/01/2024",
                      status: "Активен",
                      color: "purple"
                    }].map((dataset, index) => <Card key={index} className="transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-lg bg-${dataset.color}-100 dark:bg-${dataset.color}-900/20 flex items-center justify-center`}>
                                  <Database className={`h-5 w-5 text-${dataset.color}-600 dark:text-${dataset.color}-400`} />
                                </div>
                                <div>
                                  <h4 className="font-medium">{dataset.name}</h4>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>Тип: {dataset.type}</span>
                                    <span>Строк: {dataset.rows}</span>
                                    <span>Владелец: {dataset.owner}</span>
                                    <span>Обновлен: {dataset.updated}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={dataset.status === "Активен" ? "secondary" : "outline"}>
                                  {dataset.status}
                                </Badge>
                                <Button variant="ghost" size="sm" title="Профилирование">
                                  <BarChart3 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" title="Просмотр">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" title="Настройки">
                                  <Settings className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" title="Скачать">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>)}
                    </div>
                  </TabsContent>

                  <TabsContent value="transformation" className="mt-4">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold">Конструктор трансформаций</h4>
                          <p className="text-muted-foreground">Визуальное создание пайплайнов обработки данных</p>
                        </div>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Новый рецепт
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Transform Builder */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Workflow className="h-5 w-5" />
                              Шаги трансформации
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {[{
                              icon: Filter,
                              name: "Фильтр",
                              desc: "Строки где age > 25"
                            }, {
                              icon: Layers,
                              name: "Группировка",
                              desc: "По городам"
                            }, {
                              icon: BarChart3,
                              name: "Агрегация",
                              desc: "Среднее значение дохода"
                            }].map((step, index) => <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                  <step.icon className="h-4 w-4 text-primary" />
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{step.name}</div>
                                    <div className="text-xs text-muted-foreground">{step.desc}</div>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Settings className="h-3 w-3" />
                                  </Button>
                                </div>)}
                              <Button variant="outline" className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Добавить шаг
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Preview */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Eye className="h-5 w-5" />
                              Предпросмотр результата
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="text-sm text-muted-foreground">Первые 10 строк после трансформации:</div>
                              <div className="border rounded overflow-hidden">
                                <table className="w-full text-sm">
                                  <thead className="bg-muted">
                                    <tr>
                                      <th className="p-2 text-left">Город</th>
                                      <th className="p-2 text-left">Средний доход</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="border-t">
                                      <td className="p-2">Алматы</td>
                                      <td className="p-2">₸450,000</td>
                                    </tr>
                                    <tr className="border-t">
                                      <td className="p-2">Астана</td>
                                      <td className="p-2">₸520,000</td>
                                    </tr>
                                    <tr className="border-t">
                                      <td className="p-2">Шымкент</td>
                                      <td className="p-2">₸380,000</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  Экспорт
                                </Button>
                                <Button size="sm">
                                  <Play className="h-4 w-4 mr-2" />
                                  Применить
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="automl" className="mt-4">
                    <div className="space-y-6">
                      {/* AutoML Model Types */}
                      <div>
                        <h4 className="text-lg font-semibold mb-4">Типы моделей AutoML</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <Card className="cursor-pointer">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-blue-600" />
                                Классификация
                              </CardTitle>
                              <CardDescription>Создание моделей для категоризации данных</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button className="w-full bg-primary">
                                Создать модель
                              </Button>
                            </CardContent>
                          </Card>

                          <Card className="cursor-pointer">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                                Регрессия
                              </CardTitle>
                              <CardDescription>Прогнозирование числовых значений</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button className="w-full bg-primary">
                                Создать модель
                              </Button>
                            </CardContent>
                          </Card>

                          <Card className="cursor-pointer">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-blue-600" />
                                Временные ряды
                              </CardTitle>
                              <CardDescription>Анализ и прогнозирование трендов</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button className="w-full bg-primary">
                                Создать модель
                              </Button>
                            </CardContent>
                          </Card>

                          <Card className="cursor-pointer">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Network className="h-5 w-5 text-blue-600" />
                                Кластеризация
                              </CardTitle>
                              <CardDescription>Группировка данных по схожести</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button className="w-full bg-primary">
                                Создать модель
                              </Button>
                            </CardContent>
                          </Card>

                          <Card className="cursor-pointer">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Bot className="h-5 w-5 text-blue-600" />
                                Рекомендации
                              </CardTitle>
                              <CardDescription>Системы рекомендаций и персонализация</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button className="w-full bg-primary">
                                Создать модель
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* AutoML Master */}
                      <div>
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Sparkles className="h-5 w-5" />
                              Мастер AutoML
                            </CardTitle>
                            <CardDescription>Пошаговое создание модели машинного обучения</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              <div>
                                <label className="text-sm font-medium mb-2 block">Датасет</label>
                                <Button variant="outline" className="w-full justify-between">
                                  Выберите датасет
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-2 block">Целевая переменная</label>
                                <Button variant="outline" className="w-full justify-between">
                                  Выберите колонку
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <Button className="w-full bg-primary">
                              <Play className="h-4 w-4 mr-2" />
                              Запустить AutoML
                            </Button>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Templates */}
                      <div>
                        <h5 className="font-medium mb-3">Готовые шаблоны AutoML</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {[{
                          name: "Прогноз продаж",
                          desc: "Временные ряды",
                          icon: TrendingUp,
                          color: "blue"
                        }, {
                          name: "Скоринг клиентов",
                          desc: "Классификация",
                          icon: Users,
                          color: "green"
                        }, {
                          name: "Детекция аномалий",
                          desc: "Аномалии",
                          icon: AlertTriangle,
                          color: "orange"
                        }, {
                          name: "Прогноз оттока",
                          desc: "Churn prediction",
                          icon: Users,
                          color: "red"
                        }].map((template, index) => <Card key={index} className="cursor-pointer">
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className={`w-8 h-8 rounded bg-${template.color}-100 dark:bg-${template.color}-900/20 flex items-center justify-center`}>
                                    <template.icon className={`h-4 w-4 text-${template.color}-600 dark:text-${template.color}-400`} />
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm">{template.name}</div>
                                    <div className="text-xs text-muted-foreground">{template.desc}</div>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" className="w-full">
                                  Использовать
                                </Button>
                              </CardContent>
                            </Card>)}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="models" className="mt-4">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold">Реестр моделей</h4>
                          <p className="text-muted-foreground">Управление обученными моделями и их развертывание</p>
                        </div>
                        <Button variant="outline">
                          <Filter className="h-4 w-4 mr-2" />
                          Фильтр по статусу
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {[{
                        name: "Sales Forecast v1.2",
                        type: "Регрессия",
                        accuracy: "92.5%",
                        status: "Продакшн",
                        updated: "14/01/2024",
                        color: "green"
                      }, {
                        name: "Customer Churn v2.1",
                        type: "Классификация",
                        accuracy: "87.2%",
                        status: "Тестирование",
                        updated: "13/01/2024",
                        color: "blue"
                      }, {
                        name: "Anomaly Detection v1.0",
                        type: "Аномалии",
                        accuracy: "94.1%",
                        status: "Разработка",
                        updated: "12/01/2024",
                        color: "orange"
                      }].map((model, index) => <Card key={index} className="">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`h-10 w-10 rounded-lg bg-${model.color}-100 dark:bg-${model.color}-900/20 flex items-center justify-center`}>
                                    <Brain className={`h-5 w-5 text-${model.color}-600 dark:text-${model.color}-400`} />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{model.name}</h4>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                      <span>Тип: {model.type}</span>
                                      <span>Точность: {model.accuracy}</span>
                                      <span>Обновлено: {model.updated}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={model.status === "Продакшн" ? "secondary" : "outline"}>
                                    {model.status}
                                  </Badge>
                                  <Button variant="ghost" size="sm" title="Тестировать">
                                    <TestTube className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" title="API">
                                    <Code className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" title="Развернуть">
                                    <Play className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" title="Настройки">
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>)}
                      </div>
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
                      <Card className="">
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

                      <Card className="">
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

                      <Card className="">
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
                  <Card className="cursor-pointer">
                    <CardContent className="p-6">
                      <FileText className="h-8 w-8 text-blue-500 mb-4" />
                      <h4 className="font-medium mb-2">Начало работы</h4>
                      <p className="text-sm text-muted-foreground">Основы создания и настройки AI агентов</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer">
                    <CardContent className="p-6">
                      <Settings className="h-8 w-8 text-green-500 mb-4" />
                      <h4 className="font-medium mb-2">API Reference</h4>
                      <p className="text-sm text-muted-foreground">Полная документация по API</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer">
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
    </div>;
}