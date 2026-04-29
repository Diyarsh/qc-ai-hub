import { useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  Brain,
  MessageSquare,
  BookOpen,
  Building2,
  TrendingUp,
  TrendingDown,
  ThumbsUp,
  ThumbsDown,
  CircleDot,
  Activity,
  Clock,
  Cpu,
  AlertTriangle,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  Download,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAdminRole } from "@/contexts/AdminRoleContext";

type Period = "7d" | "30d" | "90d";

const PERIODS: { id: Period; label: string; days: number }[] = [
  { id: "7d", label: "7 дней", days: 7 },
  { id: "30d", label: "30 дней", days: 30 },
  { id: "90d", label: "90 дней", days: 90 },
];

const COMPANY_OPTIONS = [
  { id: "all", label: "Все компании", factor: 1 },
  { id: "samruk-kazyna", label: "АО «Самрук-Қазына»", factor: 0.42 },
  { id: "qazaqgaz", label: "АО «QazaqGaz»", factor: 0.31 },
  { id: "kazmunaigas", label: "АО НК «КазМунайГаз»", factor: 0.38 },
  { id: "kazatomprom", label: "АО «НАК Казатомпром»", factor: 0.27 },
  { id: "kegoc", label: "АО «KEGOC»", factor: 0.24 },
  { id: "samruk-energo", label: "АО «Самрук-Энерго»", factor: 0.26 },
  { id: "ktz", label: "АО «НК «Қазақстан Темір Жолы»»", factor: 0.36 },
  { id: "air-astana", label: "АО «Air Astana»", factor: 0.22 },
  { id: "telecom", label: "АО «Казахтелеком»", factor: 0.29 },
  { id: "kazpost", label: "АО «Казпочта»", factor: 0.2 },
  { id: "tau-ken", label: "АО «Тау-Кен Самрук»", factor: 0.18 },
  { id: "samruk-kazyna-construction", label: "ТОО «Samruk-Kazyna Construction»", factor: 0.17 },
  { id: "samruk-kazyna-business-service", label: "ТОО «Samruk-Kazyna Business Service»", factor: 0.16 },
  { id: "samruk-kazyna-onim", label: "ТОО «Samruk-Kazyna Ondeu»", factor: 0.15 },
  { id: "qazcloud", label: "ТОО «QazCloud»", factor: 0.14 },
  { id: "qfl", label: "АО «Qazaq Air / Samruk-Kazyna»", factor: 0.13 },
  { id: "kpi", label: "ТОО «KPI Inc.»", factor: 0.12 },
  { id: "ssc", label: "ТОО «Samruk-Kazyna Контракт»", factor: 0.11 },
] as const;

function fmtDate(d: Date) {
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
}

function generateActivity(days: number, factor = 1) {
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    const dow = d.getDay();
    const weekend = dow === 0 || dow === 6;
    const base = 380 + Math.sin(i / 4) * 80 + i * 4;
    const noise = (Math.sin(i * 1.7) + Math.cos(i * 0.9)) * 30;
    const requests = Math.max(
      40,
      Math.round((base + noise) * (weekend ? 0.35 : 1) * factor),
    );
    const users = Math.max(8, Math.round(requests / 9 + (weekend ? 0 : 5)));
    const tokens = Math.round(requests * (320 + Math.sin(i / 3) * 60));
    return {
      date: fmtDate(d),
      iso: d.toISOString().slice(0, 10),
      requests,
      users,
      tokens,
    };
  });
}

const TOP_AGENTS = [
  { name: "Customer Support", requests: 4280, type: "CHAT" },
  { name: "Document Analyzer", requests: 3120, type: "ANALYSIS" },
  { name: "Code Assistant", requests: 2640, type: "TASK" },
  { name: "Research Assistant", requests: 1980, type: "ANALYSIS" },
  { name: "Translation", requests: 1560, type: "TASK" },
  { name: "Content Writer", requests: 1240, type: "TASK" },
];

const LLM_USAGE = [
  { name: "GPT-4 Turbo", value: 5840, color: "hsl(217, 91%, 60%)" },
  { name: "Llama 3 70B", value: 3120, color: "hsl(262, 83%, 58%)" },
  { name: "DeepSeek V3", value: 2450, color: "hsl(174, 72%, 45%)" },
  { name: "Qwen 2.5", value: 1820, color: "hsl(45, 93%, 47%)" },
  { name: "GPT-3.5", value: 1280, color: "hsl(0, 84%, 60%)" },
];

const FEEDBACK_DISTRIBUTION = [
  { name: "Верно", value: 68, color: "hsl(142, 71%, 45%)" },
  { name: "Частично верно", value: 22, color: "hsl(45, 93%, 47%)" },
  { name: "Неверно", value: 10, color: "hsl(0, 84%, 60%)" },
];

const DEPARTMENT_USAGE = [
  { name: "Разработка", requests: 3240, users: 18 },
  { name: "Аналитика", requests: 2580, users: 12 },
  { name: "Поддержка", requests: 2120, users: 14 },
  { name: "Маркетинг", requests: 1480, users: 9 },
  { name: "HR", requests: 820, users: 6 },
  { name: "Финансы", requests: 640, users: 5 },
];

const RECENT_FEEDBACK = [
  {
    id: 1,
    user: "user_001",
    agent: "Customer Support",
    verdict: "CORRECT" as const,
    text: "Корректный ответ по методологии, учтены все требования.",
    time: "10 мин назад",
  },
  {
    id: 2,
    user: "analyst_demo",
    agent: "Document Analyzer",
    verdict: "PARTIALLY_CORRECT" as const,
    text: "Требуется уточнение формулировки в пункте ответа.",
    time: "32 мин назад",
  },
  {
    id: 3,
    user: "lawyer_demo",
    agent: "Research Assistant",
    verdict: "CORRECT" as const,
    text: "Структура ответа удобна для использования.",
    time: "1 ч назад",
  },
  {
    id: 4,
    user: "support_qa",
    agent: "Code Assistant",
    verdict: "INCORRECT" as const,
    text: "Указанная в ответе версия библиотеки устарела.",
    time: "2 ч назад",
  },
  {
    id: 5,
    user: "demo_user",
    agent: "Translation",
    verdict: "CORRECT" as const,
    text: "Положительная оценка: перевод корректен и естественен.",
    time: "3 ч назад",
  },
];

const VERDICT_STYLES = {
  CORRECT: {
    label: "Верно",
    chip: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    icon: ThumbsUp,
  },
  PARTIALLY_CORRECT: {
    label: "Частично",
    chip: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    icon: CircleDot,
  },
  INCORRECT: {
    label: "Неверно",
    chip: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
    icon: ThumbsDown,
  },
};

const TOP_USERS = [
  { name: "Иван Петров", login: "user_001", department: "Разработка", requests: 412 },
  { name: "Мария Сидорова", login: "analyst_demo", department: "Аналитика", requests: 348 },
  { name: "Алексей Козлов", login: "support_qa", department: "Поддержка", requests: 286 },
  { name: "Елена Волкова", login: "demo_user", department: "Маркетинг", requests: 224 },
  { name: "Дмитрий Новиков", login: "lawyer_demo", department: "HR", requests: 168 },
];

interface KpiProps {
  label: string;
  value: string;
  delta?: number;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
  accent: string;
}

function Kpi({ label, value, delta, icon: Icon, hint, accent }: KpiProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <Card className="p-5 bg-card border-border relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
            {value}
          </p>
          {hint && (
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          )}
        </div>
        <span
          className={cn(
            "shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-lg border",
            accent,
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {typeof delta === "number" && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-medium",
              positive
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "bg-red-500/10 text-red-700 dark:text-red-400",
            )}
          >
            {positive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {positive ? "+" : ""}
            {delta}%
          </span>
          <span className="text-muted-foreground">vs пред. период</span>
        </div>
      )}
    </Card>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-md">
      {label && <p className="text-xs text-muted-foreground mb-1">{label}</p>}
      {payload.map((p: any) => (
        <p key={p.dataKey ?? p.name} className="text-xs flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: p.color || p.fill }}
          />
          <span className="text-foreground font-medium">
            {p.name}:
          </span>
          <span className="text-foreground tabular-nums">
            {Number(p.value).toLocaleString("ru-RU")}
          </span>
        </p>
      ))}
    </div>
  );
}

export default function Analytics() {
  const { role, getScope } = useAdminRole();
  const [period, setPeriod] = useState<Period>("30d");
  const [selectedCompany, setSelectedCompany] = useState<string>("all");

  const scope = getScope("analytics");
  const isCompanyScope = scope === "company";
  const isDepartmentScope = scope === "department";
  const isAllScope = scope === "all";

  const headerCopy = useMemo(() => {
    if (isAllScope) {
      return {
        title: "Обзор платформы",
        subtitle: "Ключевые показатели использования AI-HUB по всем компаниям",
        scopeLabel: "По всем компаниям",
      };
    }
    if (isCompanyScope) {
      return {
        title: "Аналитика компании",
        subtitle: "Активность сотрудников и AI-агентов вашей организации",
        scopeLabel: "В рамках организации",
      };
    }
    return {
      title: "Аналитика департамента",
      subtitle: "Активность сотрудников и AI-агентов вашего департамента",
      scopeLabel: "В рамках департамента",
    };
  }, [isAllScope, isCompanyScope]);

  const days = PERIODS.find((p) => p.id === period)!.days;
  const selectedCompanyFactor =
    COMPANY_OPTIONS.find((c) => c.id === selectedCompany)?.factor ?? 1;
  const factor = isAllScope
    ? selectedCompanyFactor
    : isCompanyScope
      ? selectedCompanyFactor * 0.45
      : 0.18;
  const activity = useMemo(() => generateActivity(days, factor), [days, factor]);

  const totals = useMemo(() => {
    const requests = activity.reduce((s, x) => s + x.requests, 0);
    const tokens = activity.reduce((s, x) => s + x.tokens, 0);
    const avgUsers = Math.round(
      activity.reduce((s, x) => s + x.users, 0) / activity.length,
    );
    return { requests, tokens, avgUsers };
  }, [activity]);

  const topAgents = isDepartmentScope ? TOP_AGENTS.slice(0, 4) : TOP_AGENTS;
  const topUsers = isDepartmentScope ? TOP_USERS.slice(0, 3) : TOP_USERS;
  const departments = isDepartmentScope
    ? []
    : isCompanyScope
      ? DEPARTMENT_USAGE.slice(0, 4)
      : DEPARTMENT_USAGE;

  const summaryCards = useMemo(() => {
    if (isAllScope) {
      return [
        { label: "Компаний", value: "5", icon: Building2 },
        { label: "Департаментов", value: "18", icon: Users },
        { label: "Базы знаний", value: "42", icon: BookOpen },
        { label: `Токены (${period})`, value: `${(totals.tokens / 1_000_000).toFixed(1)}M`, icon: Cpu },
      ];
    }
    if (isCompanyScope) {
      return [
        { label: "Департаментов", value: "6", icon: Users },
        { label: "Сотрудников", value: "84", icon: UserCheck },
        { label: "Базы знаний", value: "12", icon: BookOpen },
        { label: `Токены (${period})`, value: `${(totals.tokens / 1_000).toFixed(0)}K`, icon: Cpu },
      ];
    }
    return [
      { label: "Сотрудников", value: "14", icon: UserCheck },
      { label: "AI-агентов", value: "5", icon: Brain },
      { label: "Базы знаний", value: "4", icon: BookOpen },
      { label: `Токены (${period})`, value: `${(totals.tokens / 1_000).toFixed(0)}K`, icon: Cpu },
    ];
  }, [isAllScope, isCompanyScope, period, totals.tokens]);

  const handleExportExcel = () => {
    const headers = ["Дата", "Запросы", "Активные пользователи", "Токены"];
    const rows = activity.map((row) =>
      [row.iso, row.requests, row.users, row.tokens].join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${role.id.toLowerCase()}-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportWord = () => {
    const totalRequests = totals.requests.toLocaleString("ru-RU");
    const totalTokens = totals.tokens.toLocaleString("ru-RU");
    const html = `
      <html>
        <head><meta charset="utf-8" /></head>
        <body>
          <h2>AI-HUB · ${headerCopy.title} (${period})</h2>
          <p><em>${headerCopy.scopeLabel}</em></p>
          <p><strong>Активные пользователи (среднее в день):</strong> ${totals.avgUsers}</p>
          <p><strong>Запросы к агентам:</strong> ${totalRequests}</p>
          <p><strong>Токены:</strong> ${totalTokens}</p>
          <h3>Дневная динамика</h3>
          <table border="1" cellspacing="0" cellpadding="6">
            <tr>
              <th>Дата</th>
              <th>Запросы</th>
              <th>Активные пользователи</th>
              <th>Токены</th>
            </tr>
            ${activity
              .map(
                (row) => `
                  <tr>
                    <td>${row.iso}</td>
                    <td>${row.requests}</td>
                    <td>${row.users}</td>
                    <td>${row.tokens}</td>
                  </tr>`,
              )
              .join("")}
          </table>
        </body>
      </html>
    `;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${role.id.toLowerCase()}-${period}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            {headerCopy.title}
          </h1>
          <p className="mt-1 text-muted-foreground">{headerCopy.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!isDepartmentScope && (
            <div className="relative">
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 py-1.5 text-sm appearance-none pr-8"
                aria-label="Фильтр по компании"
              >
                {COMPANY_OPTIONS.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleExportExcel}
          >
            <Download className="h-4 w-4" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleExportWord}
          >
            <Download className="h-4 w-4" />
            Word
          </Button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Последние</span>
          </div>
          <div className="inline-flex rounded-md border border-border bg-card p-0.5">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  period === p.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi
          label="Активные пользователи"
          value={isAllScope ? "247" : isCompanyScope ? "112" : "14"}
          delta={12.4}
          icon={UserCheck}
          hint={`в среднем ${totals.avgUsers}/день`}
          accent="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
        />
        <Kpi
          label="Запросы к агентам"
          value={totals.requests.toLocaleString("ru-RU")}
          delta={8.7}
          icon={MessageSquare}
          hint="Всего за период"
          accent="bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30"
        />
        <Kpi
          label={isAllScope ? "Активные AI-агенты" : "Доступные AI-агенты"}
          value={isAllScope ? "12 / 14" : isCompanyScope ? "8 / 10" : "5 / 5"}
          delta={4.2}
          icon={Brain}
          hint="Использовались за период"
          accent="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30"
        />
        <Kpi
          label="Удовлетворённость"
          value="86%"
          delta={2.1}
          icon={ThumbsUp}
          hint="Положительные отзывы"
          accent="bg-[#ab824b]/10 text-[#ab824b] border-[#ab824b]/30"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-4 bg-card border-border">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span className="text-xs">{s.label}</span>
              </div>
              <p className="mt-1.5 text-xl font-semibold text-foreground tabular-nums">
                {s.value}
              </p>
            </Card>
          );
        })}
      </div>

      <Card className="p-5 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Активность платформы
            </h2>
            <p className="text-xs text-muted-foreground">
              Запросы и активные пользователи по дням
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-[hsl(217,91%,60%)]" />
              Запросы
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-[hsl(142,71%,45%)]" />
              Активные пользователи
            </span>
          </div>
        </div>
        <div className="h-72 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activity}>
              <defs>
                <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="usrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval={Math.max(0, Math.floor(activity.length / 8))}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="requests"
                name="Запросы"
                stroke="hsl(217, 91%, 60%)"
                strokeWidth={2}
                fill="url(#reqGrad)"
              />
              <Area
                type="monotone"
                dataKey="users"
                name="Активные пользователи"
                stroke="hsl(142, 71%, 45%)"
                strokeWidth={2}
                fill="url(#usrGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 bg-card border-border lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Топ AI-агенты
              </h2>
              <p className="text-xs text-muted-foreground">По количеству запросов за период</p>
            </div>
            <span className="text-xs text-muted-foreground">
              всего {topAgents.reduce((s, a) => s + a.requests, 0).toLocaleString("ru-RU")}
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topAgents} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={120}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
                <Bar
                  dataKey="requests"
                  name="Запросы"
                  fill="hsl(217, 91%, 60%)"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Использование LLM
              </h2>
              <p className="text-xs text-muted-foreground">Доля запросов</p>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={LLM_USAGE}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="55%"
                  outerRadius="90%"
                  paddingAngle={2}
                  stroke="hsl(var(--background))"
                >
                  {LLM_USAGE.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-1.5">
            {LLM_USAGE.map((entry) => {
              const total = LLM_USAGE.reduce((s, x) => s + x.value, 0);
              const pct = ((entry.value / total) * 100).toFixed(1);
              return (
                <div key={entry.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ background: entry.color }}
                  />
                  <span className="flex-1 text-foreground truncate">{entry.name}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {entry.value.toLocaleString("ru-RU")}
                  </span>
                  <span className="tabular-nums text-muted-foreground w-10 text-right">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          departments.length > 0 ? "lg:grid-cols-3" : "lg:grid-cols-1",
        )}
      >
        {departments.length > 0 && (
          <Card className="p-5 bg-card border-border lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Активность по департаментам
                </h2>
                <p className="text-xs text-muted-foreground">
                  Запросы и количество пользователей
                </p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departments}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar
                    yAxisId="left"
                    dataKey="requests"
                    name="Запросы"
                    fill="hsl(217, 91%, 60%)"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="users"
                    name="Пользователи"
                    fill="hsl(262, 83%, 58%)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        <Card
          className={cn(
            "p-5 bg-card border-border",
            departments.length === 0 && "lg:col-span-1",
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Качество ответов
              </h2>
              <p className="text-xs text-muted-foreground">Распределение оценок</p>
            </div>
          </div>
          <div className="space-y-3">
            {FEEDBACK_DISTRIBUTION.map((f) => (
              <div key={f.name}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-foreground">{f.name}</span>
                  <span className="tabular-nums text-muted-foreground">{f.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${f.value}%`, background: f.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-border grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ThumbsUp className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Положительные</p>
                <p className="text-sm font-semibold tabular-nums">1 248</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-500/10 text-red-600 dark:text-red-400">
                <ThumbsDown className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Отрицательные</p>
                <p className="text-sm font-semibold tabular-nums">186</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Последние отзывы
              </h2>
              <p className="text-xs text-muted-foreground">
                Обратная связь по ответам агентов
              </p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              Все отзывы
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-3">
            {RECENT_FEEDBACK.map((f) => {
              const v = VERDICT_STYLES[f.verdict];
              const VIcon = v.icon;
              return (
                <div
                  key={f.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <span
                    className={cn(
                      "shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-md border",
                      v.chip,
                    )}
                  >
                    <VIcon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                      <span className="font-medium text-foreground">{f.user}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-muted-foreground">{f.agent}</span>
                      <span
                        className={cn(
                          "ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border",
                          v.chip,
                        )}
                      >
                        {v.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {f.text}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground/80 inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {f.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Самые активные пользователи
              </h2>
              <p className="text-xs text-muted-foreground">По количеству запросов</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              Все пользователи
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-2.5">
            {topUsers.map((u, i) => (
              <div
                key={u.login}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <span className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-semibold">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {u.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {u.login} · {u.department}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground tabular-nums">
                    {u.requests}
                  </p>
                  <p className="text-[10px] text-muted-foreground">запросов</p>
                </div>
              </div>
            ))}
          </div>

          {isAllScope && (
            <div className="mt-5 pt-4 border-t border-border">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-medium text-foreground">Внимание</p>
                  <p className="text-muted-foreground mt-0.5">
                    3 LLM-модели показали повышенный latency за последние 24ч.
                    Проверьте раздел «LLM Модели».
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      <p className="text-[11px] text-muted-foreground text-center">
        Данные приведены под ролью «{role.label}» · {headerCopy.scopeLabel.toLowerCase()}
      </p>
    </div>
  );
}
