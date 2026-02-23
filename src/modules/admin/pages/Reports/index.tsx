import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RefreshCw, Download, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Calendar } from "lucide-react";
import { useToast } from "@/shared/components/Toast";
import { cn } from "@/lib/utils";

type ReportType = "standard" | "detailed" | "users" | "summary";
type TabFormat = "byUsers" | "byDepartments";

export interface AgentFeedbackRow {
  id: string;
  userLogin: string;
  email: string;
  companyId: string;
  departmentId: string;
  createdAt: string;
  interactionId: string;
  requestId: string;
  reason: string;
  verdict: "CORRECT" | "PARTIALLY_CORRECT" | "INCORRECT";
  aiAgentId: string;
}

// Мокап-данные для демо (без конфиденциальной информации)
const MOCK_LOGINS = ["user_001", "user_002", "demo_user", "test_agent_1", "khabar_user1", "support_qa", "reviewer_2", "analyst_demo", "lawyer_demo", "consultant_1"];
const MOCK_EMAILS = ["user001@example.com", "user002@example.com", "demo@test.kz", "agent1@demo.local", "khabar1@example.com", "qa@demo.kz", "reviewer@test.kz", "analyst@example.com", "lawyer@demo.kz", "consult@test.kz"];
const MOCK_REASONS = [
  "Пример комментария: ответ агента полный и соответствует запросу.",
  "Требуется уточнение формулировки в пункте ответа.",
  "В ответе указана ссылка на документ, не относящийся к вопросу.",
  "Корректный ответ по методологии, учтены все требования.",
  "Неполный ответ: отсутствует раздел по порядку проведения процедур.",
  "Ответ содержит релевантные ссылки на внутренние регламенты (пример).",
  "Рекомендуется доработка раздела о правах заказчика в типовой форме.",
  "Пример обратной связи: структура ответа удобна для использования.",
  "Указанная в ответе дата не соответствует актуальной редакции документа.",
  "Положительная оценка: агент корректно применил шаблон ответа.",
];
const VERDICTS: AgentFeedbackRow["verdict"][] = ["CORRECT", "PARTIALLY_CORRECT", "INCORRECT"];
const AI_AGENT_IDS = ["2551", "2552", "2560", "2756", "1951", "2562", "2559", "2752"];

function generateMockFeedback(count: number): AgentFeedbackRow[] {
  const rows: AgentFeedbackRow[] = [];
  const baseDate = new Date("2026-01-20T00:00:00.000Z").getTime();
  for (let i = 0; i < count; i++) {
    const loginIdx = i % MOCK_LOGINS.length;
    const hasEmail = i % 3 !== 1;
    rows.push({
      id: String(i + 1),
      userLogin: MOCK_LOGINS[loginIdx] + (i >= MOCK_LOGINS.length ? `_${Math.floor(i / MOCK_LOGINS.length)}` : ""),
      email: hasEmail ? MOCK_EMAILS[loginIdx] : "",
      companyId: i % 2 === 0 ? "1500" : "1505",
      departmentId: i % 2 === 0 ? "1500" : "1505",
      createdAt: new Date(baseDate + i * 3600000).toISOString(),
      interactionId: Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      requestId: i % 4 === 0 ? `req-${String(i).padStart(3, "0")}` : "",
      reason: MOCK_REASONS[i % MOCK_REASONS.length],
      verdict: VERDICTS[i % VERDICTS.length],
      aiAgentId: AI_AGENT_IDS[i % AI_AGENT_IDS.length],
    });
  }
  return rows;
}

const PAGE_SIZE = 20;
const MOCK_TOTAL = 100;
const mockFeedback = generateMockFeedback(MOCK_TOTAL);

type SortKey = keyof AgentFeedbackRow | "";
const VERDICT_LABELS: Record<string, string> = {
  CORRECT: "Верно",
  PARTIALLY_CORRECT: "Частично верно",
  INCORRECT: "Неверно",
};

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("ru-RU", {
      dateStyle: "short",
      timeStyle: "medium",
      hour12: false,
    });
  } catch {
    return iso;
  }
}

const totalPages = Math.ceil(MOCK_TOTAL / PAGE_SIZE);

export default function Reports() {
  const [data, setData] = useState<AgentFeedbackRow[]>(mockFeedback);
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [reportType, setReportType] = useState<ReportType>("standard");
  const [tabFormat, setTabFormat] = useState<TabFormat>("byUsers");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterAgent, setFilterAgent] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const { showToast } = useToast();

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey as keyof AgentFeedbackRow];
      const bVal = b[sortKey as keyof AgentFeedbackRow];
      const cmp = String(aVal ?? "").localeCompare(String(bVal ?? ""), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedData.slice(start, start + PAGE_SIZE);
  }, [sortedData, page]);

  const startItem = (page - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(page * PAGE_SIZE, MOCK_TOTAL);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-primary" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-primary" />
    );
  };

  const handleExport = () => {
    const headers = [
      "User Login",
      "Email",
      "Company Id",
      "Department Id",
      "Created At",
      "Interaction Id",
      "Request Id",
      "Reason",
      "Verdict",
      "AI Agent",
    ];
    const rows = sortedData.map((r) =>
      [
        r.userLogin,
        r.email,
        r.companyId,
        r.departmentId,
        r.createdAt,
        r.interactionId,
        r.requestId,
        `"${(r.reason || "").replace(/"/g, '""')}"`,
        r.verdict,
        r.aiAgentId,
      ].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    a.download = reportType === "summary" ? `summary-report-${dateStr}.csv` : `agent-feedback-answers-${dateStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(reportType === "summary" ? "Отчет запрошен, файл скачивается" : "Отчет выгружен", "success");
  };

  const handleRefresh = () => {
    setData((prev) => [...prev]);
    showToast("Список обновлен", "success");
  };

  const handleDownloadFromModal = () => {
    handleExport();
    setDownloadModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ответы обратной связи агентов</h1>
          <p className="text-muted-foreground mt-1">
            Таблица отзывов пользователей по ответам AI-агентов
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setDownloadModalOpen(true)} className="gap-2">
            <Download className="h-4 w-4" />
            Выгрузить отчет
          </Button>
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Обновить список
          </Button>
        </div>
      </div>

      <Card className="rounded-xl border border-border bg-card text-card-foreground overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {[
                  { key: "userLogin" as SortKey, label: "User Login" },
                  { key: "email" as SortKey, label: "Email" },
                  { key: "companyId" as SortKey, label: "Company Id" },
                  { key: "departmentId" as SortKey, label: "Department Id" },
                  { key: "createdAt" as SortKey, label: "Created At" },
                  { key: "interactionId" as SortKey, label: "Interaction Id" },
                  { key: "requestId" as SortKey, label: "Request Id" },
                  { key: "reason" as SortKey, label: "Reason" },
                  { key: "verdict" as SortKey, label: "Verdict" },
                  { key: "aiAgentId" as SortKey, label: "AI Agent" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className="text-left font-medium text-muted-foreground px-4 py-3 whitespace-nowrap"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(key)}
                      className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      {label}
                      <SortIcon column={key} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 text-foreground">{row.userLogin}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.email || "—"}</td>
                  <td className="px-4 py-3 text-foreground">{row.companyId}</td>
                  <td className="px-4 py-3 text-foreground">{row.departmentId}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {formatDate(row.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`#/interaction/${row.interactionId}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {row.interactionId}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.requestId || "—"}</td>
                  <td className="px-4 py-3 text-foreground max-w-[280px]">
                    <span
                      className="line-clamp-2 block"
                      title={row.reason}
                    >
                      {row.reason || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded-md text-xs font-medium",
                        row.verdict === "CORRECT" &&
                          "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
                        row.verdict === "PARTIALLY_CORRECT" &&
                          "bg-amber-500/15 text-amber-700 dark:text-amber-400",
                        row.verdict === "INCORRECT" &&
                          "bg-red-500/15 text-red-700 dark:text-red-400"
                      )}
                    >
                      {VERDICT_LABELS[row.verdict] ?? row.verdict}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`#/admin/ai-agents/${row.aiAgentId}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {row.aiAgentId}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Пагинация */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-border bg-muted/20">
          <p className="text-sm text-muted-foreground order-2 sm:order-1">
            Показываем {startItem}&ndash;{endItem} из {MOCK_TOTAL}.
          </p>
          <div className="flex items-center gap-1 order-1 sm:order-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(1)}
              disabled={page <= 1}
              aria-label="В начало"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              aria-label="Назад"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-0.5 mx-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8 min-w-8"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="px-1 text-muted-foreground">…</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 min-w-8"
                    onClick={() => setPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              aria-label="Вперёд"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(totalPages)}
              disabled={page >= totalPages}
              aria-label="В конец"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Модальное окно выгрузки отчёта */}
      <Dialog open={downloadModalOpen} onOpenChange={setDownloadModalOpen}>
        <DialogContent className="max-w-[780px] w-[95vw] bg-card border-border p-0 gap-0 overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-foreground">Download Report</DialogTitle>
            </DialogHeader>
          </div>

          {/* Tabs - one row */}
          <Tabs
            value={reportType}
            onValueChange={(v) => setReportType(v as ReportType)}
            className="w-full"
          >
            <div className="px-6">
              <div className="flex flex-nowrap gap-2">
                {[
                  { value: "standard", label: "Standard Report" },
                  { value: "detailed", label: "Детальный отчёт" },
                  { value: "users", label: "Пользователи" },
                  { value: "summary", label: "Сводка по компаниям" },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setReportType(tab.value as ReportType)}
                    className={cn(
                      "flex-1 min-w-[11rem] px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap text-center",
                      reportType === tab.value
                        ? "bg-muted text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-b border-border mt-4" />

            {/* Tab content + filters */}
            <div className="px-6 py-5 space-y-5">
              {/* Standard Report */}
              {reportType === "standard" && (
                <>
                  <div className="space-y-2 mb-1">
                    <Label className="text-foreground font-medium">Формат вкладок</Label>
                    <div className="flex gap-5 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tabFormat"
                          checked={tabFormat === "byUsers"}
                          onChange={() => setTabFormat("byUsers")}
                          className="rounded-full border-input text-primary focus:ring-primary accent-primary"
                        />
                        <span className="text-sm text-foreground">По пользователям</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tabFormat"
                          checked={tabFormat === "byDepartments"}
                          onChange={() => setTabFormat("byDepartments")}
                          className="rounded-full border-input text-primary focus:ring-primary accent-primary"
                        />
                        <span className="text-sm text-foreground">По департаментам</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="filter-company" className="text-foreground font-medium">Company</Label>
                    <Input id="filter-company" value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} placeholder="Company" className="bg-background" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="filter-department" className="text-foreground font-medium">Department</Label>
                    <Input id="filter-department" value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} placeholder="Department" className="bg-background" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="filter-agent" className="text-foreground font-medium">Agent</Label>
                    <Input id="filter-agent" value={filterAgent} onChange={(e) => setFilterAgent(e.target.value)} placeholder="Agent" className="bg-background" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="filter-from-date" className="text-foreground font-medium">From Date</Label>
                      <Input id="filter-from-date" type="date" value={filterFromDate} onChange={(e) => setFilterFromDate(e.target.value)} className="bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="filter-to-date" className="text-foreground font-medium">To Date</Label>
                      <Input id="filter-to-date" type="date" value={filterToDate} onChange={(e) => setFilterToDate(e.target.value)} className="bg-background" />
                    </div>
                  </div>
                </>
              )}

              {/* Детальный отчёт */}
              {reportType === "detailed" && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="filter-company-d" className="text-foreground font-medium">Company</Label>
                    <Input id="filter-company-d" value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} placeholder="Company" className="bg-background" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="filter-department-d" className="text-foreground font-medium">Department</Label>
                    <Input id="filter-department-d" value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} placeholder="Department" className="bg-background" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="filter-agent-d" className="text-foreground font-medium">Agent</Label>
                    <Input id="filter-agent-d" value={filterAgent} onChange={(e) => setFilterAgent(e.target.value)} placeholder="Agent" className="bg-background" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="filter-from-date-d" className="text-foreground font-medium">From Date</Label>
                      <Input id="filter-from-date-d" type="date" value={filterFromDate} onChange={(e) => setFilterFromDate(e.target.value)} className="bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="filter-to-date-d" className="text-foreground font-medium">To Date</Label>
                      <Input id="filter-to-date-d" type="date" value={filterToDate} onChange={(e) => setFilterToDate(e.target.value)} className="bg-background" />
                    </div>
                  </div>
                </>
              )}

              {/* Пользователи */}
              {reportType === "users" && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="filter-company-u" className="text-foreground font-medium">Company</Label>
                    <Input id="filter-company-u" value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} placeholder="Company" className="bg-background" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="filter-department-u" className="text-foreground font-medium">Department</Label>
                    <Input id="filter-department-u" value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} placeholder="Department" className="bg-background" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="filter-agent-u" className="text-foreground font-medium">Agent</Label>
                    <Input id="filter-agent-u" value={filterAgent} onChange={(e) => setFilterAgent(e.target.value)} placeholder="Agent" className="bg-background" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="filter-from-date-u" className="text-foreground font-medium">From Date</Label>
                      <Input id="filter-from-date-u" type="date" value={filterFromDate} onChange={(e) => setFilterFromDate(e.target.value)} className="bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="filter-to-date-u" className="text-foreground font-medium">To Date</Label>
                      <Input id="filter-to-date-u" type="date" value={filterToDate} onChange={(e) => setFilterToDate(e.target.value)} className="bg-background" />
                    </div>
                  </div>
                </>
              )}

              {/* Сводка по компаниям */}
              {reportType === "summary" && (
                <p className="text-sm text-muted-foreground">
                  Сводный отчет по всем компаниям будет сформирован и скачан в формате Excel.
                </p>
              )}
            </div>
          </Tabs>

          {/* Footer */}
          <div className="border-t border-border px-6 py-4 flex justify-end gap-3 bg-muted/20">
            <Button variant="outline" onClick={() => setDownloadModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDownloadFromModal}>
              {reportType === "summary" ? "Запросить" : "Download"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
