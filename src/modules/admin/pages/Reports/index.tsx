import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle2, AlertCircle, XCircle, Download } from "lucide-react";
import { useToast } from "@/shared/components/Toast";

interface AgentQuality {
  agentId: string;
  agentName: string;
  totalResponses: number;
  correct: number;
  partiallyCorrect: number;
  incorrect: number;
  qualityScore: number;
}

const mockAgentQuality: AgentQuality[] = [
  { agentId: "1", agentName: "Customer Support", totalResponses: 250, correct: 196, partiallyCorrect: 40, incorrect: 14, qualityScore: 87.2 },
  { agentId: "2", agentName: "Code Assistant", totalResponses: 180, correct: 150, partiallyCorrect: 20, incorrect: 10, qualityScore: 89.9 },
  { agentId: "3", agentName: "Document Analyzer", totalResponses: 130, correct: 104, partiallyCorrect: 19, incorrect: 7, qualityScore: 87.4 },
  { agentId: "4", agentName: "Data Analyst", totalResponses: 85, correct: 70, partiallyCorrect: 10, incorrect: 5, qualityScore: 89.3 },
  { agentId: "5", agentName: "Content Writer", totalResponses: 155, correct: 124, partiallyCorrect: 24, incorrect: 7, qualityScore: 87.2 },
];

export default function QA() {
  const [agents] = useState<AgentQuality[]>(mockAgentQuality);
  const { showToast } = useToast();

  const exportAgentToExcel = (agent: AgentQuality) => {
    const correctPercent = (agent.correct / agent.totalResponses) * 100;
    const partiallyCorrectPercent = (agent.partiallyCorrect / agent.totalResponses) * 100;
    const incorrectPercent = (agent.incorrect / agent.totalResponses) * 100;
    
    // Подготовка данных для экспорта отдельного агента
    const rows: string[] = [];
    
    // Заголовок отчета
    rows.push("QA - Контроль качества");
    rows.push(`Отчет по агенту: ${agent.agentName}`);
    rows.push(`Дата генерации: ${new Date().toLocaleDateString('ru-RU')}`);
    rows.push(""); // Пустая строка
    
    // Заголовки колонок
    rows.push([
      "Метрика",
      "Значение",
      "Процент"
    ].join(","));
    
    // Данные по агенту
    rows.push(["Всего ответов", agent.totalResponses, "100.0"].join(","));
    rows.push(["Верно", agent.correct, `${correctPercent.toFixed(1)}%`].join(","));
    rows.push(["Частично верно", agent.partiallyCorrect, `${partiallyCorrectPercent.toFixed(1)}%`].join(","));
    rows.push(["Неверно", agent.incorrect, `${incorrectPercent.toFixed(1)}%`].join(","));
    rows.push(["Оценка качества", `${agent.qualityScore.toFixed(1)}%`, ""].join(","));
    
    // Создание CSV контента
    const csvContent = rows.join("\n");
    
    // Создание Blob и скачивание файла
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    const date = new Date().toISOString().split('T')[0];
    const fileName = agent.agentName.toLowerCase().replace(/\s+/g, '-');
    link.setAttribute("download", `qa-report-${fileName}-${date}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`Данные по агенту "${agent.agentName}" экспортированы`, "success");
  };

  const exportToExcel = () => {
    // Подготовка данных для экспорта (CSV формат для мок-апа)
    const rows: string[] = [];
    
    // Заголовок отчета
    rows.push("QA - Контроль качества");
    rows.push("Отчет по качеству ответов AI-агентов");
    rows.push(`Дата генерации: ${new Date().toLocaleDateString('ru-RU')}`);
    rows.push(""); // Пустая строка
    
    // Заголовки колонок
    rows.push([
      "Название агента",
      "Всего ответов",
      "Верно",
      "Верно (%)",
      "Частично верно",
      "Частично верно (%)",
      "Неверно",
      "Неверно (%)",
      "Оценка качества (%)"
    ].join(","));
    
    // Данные по каждому агенту
    agents.forEach((agent) => {
      const correctPercent = (agent.correct / agent.totalResponses) * 100;
      const partiallyCorrectPercent = (agent.partiallyCorrect / agent.totalResponses) * 100;
      const incorrectPercent = (agent.incorrect / agent.totalResponses) * 100;
      
      rows.push([
        `"${agent.agentName}"`,
        agent.totalResponses,
        agent.correct,
        correctPercent.toFixed(1),
        agent.partiallyCorrect,
        partiallyCorrectPercent.toFixed(1),
        agent.incorrect,
        incorrectPercent.toFixed(1),
        agent.qualityScore.toFixed(1)
      ].join(","));
    });
    
    // Пустая строка перед итогами
    rows.push("");
    
    // Итоговая статистика
    const totalResponses = agents.reduce((sum, a) => sum + a.totalResponses, 0);
    const totalCorrect = agents.reduce((sum, a) => sum + a.correct, 0);
    const totalPartiallyCorrect = agents.reduce((sum, a) => sum + a.partiallyCorrect, 0);
    const totalIncorrect = agents.reduce((sum, a) => sum + a.incorrect, 0);
    const avgQualityScore = agents.reduce((sum, a) => sum + a.qualityScore, 0) / agents.length;
    
    rows.push("ИТОГО");
    rows.push([
      "Всего",
      totalResponses,
      totalCorrect,
      ((totalCorrect / totalResponses) * 100).toFixed(1),
      totalPartiallyCorrect,
      ((totalPartiallyCorrect / totalResponses) * 100).toFixed(1),
      totalIncorrect,
      ((totalIncorrect / totalResponses) * 100).toFixed(1),
      avgQualityScore.toFixed(1)
    ].join(","));
    
    // Создание CSV контента
    const csvContent = rows.join("\n");
    
    // Создание Blob и скачивание файла
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `qa-report-${date}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast("Данные экспортированы в CSV файл", "success");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">QA - Контроль качества</h1>
        <p className="text-muted-foreground mt-1">Мониторинг качества ответов AI-агентов на основе отзывов пользователей</p>
      </div>

      {/* Качество ответов агентов */}
      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          {agents.map((agent) => {
            const correctPercent = (agent.correct / agent.totalResponses) * 100;
            const partiallyCorrectPercent = (agent.partiallyCorrect / agent.totalResponses) * 100;
            const incorrectPercent = (agent.incorrect / agent.totalResponses) * 100;

            return (
              <div
                key={agent.agentId}
                className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{agent.agentName}</h3>
                      <p className="text-sm text-muted-foreground">Всего ответов: {agent.totalResponses}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">{agent.qualityScore}%</div>
                      <p className="text-xs text-muted-foreground">Оценка качества</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => exportAgentToExcel(agent)}
                    >
                      <Download className="h-3 w-3" />
                      Экспорт
                    </Button>
                  </div>
                </div>

                {/* Прогресс-бары */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 w-32">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-foreground">Верно</span>
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-green-500 h-full transition-all"
                        style={{ width: `${correctPercent}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-20 text-right">
                      {agent.correct} ({correctPercent.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 w-32">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-foreground">Частично верно</span>
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-500 h-full transition-all"
                        style={{ width: `${partiallyCorrectPercent}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-20 text-right">
                      {agent.partiallyCorrect} ({partiallyCorrectPercent.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 w-32">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-foreground">Неверно</span>
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-red-500 h-full transition-all"
                        style={{ width: `${incorrectPercent}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-20 text-right">
                      {agent.incorrect} ({incorrectPercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Общая статистика */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-foreground">
                {agents.reduce((sum, a) => sum + a.totalResponses, 0)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Всего ответов</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-500/10">
              <div className="text-2xl font-bold text-green-500">
                {agents.reduce((sum, a) => sum + a.correct, 0)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Верных ответов</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-500/10">
              <div className="text-2xl font-bold text-yellow-500">
                {agents.reduce((sum, a) => sum + a.partiallyCorrect, 0)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Частично верных</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-500/10">
              <div className="text-2xl font-bold text-red-500">
                {agents.reduce((sum, a) => sum + a.incorrect, 0)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Неверных ответов</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
