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
  FileText,
  MousePointerClick,
  Eye,
  FileSpreadsheet,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
import type { AIAgentType } from "@/modules/admin/pages/AIAgents/mockData";

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

interface StudioAgent {
  id: string;
  label: string;
  type: AIAgentType;
  category: string;
  deployment: "local" | "external";
  baseRequests: number;
  weight: number;
}

const AI_STUDIO_AGENTS: StudioAgent[] = [
  {
    id: "transcriber",
    label: "Транскрибатор",
    type: "ANALYSIS",
    category: "Аудио",
    deployment: "local",
    baseRequests: 4280,
    weight: 0.32,
  },
  {
    id: "summarizer",
    label: "Суммаризатор",
    type: "ANALYSIS",
    category: "Документы",
    deployment: "local",
    baseRequests: 3650,
    weight: 0.27,
  },
  {
    id: "procurement",
    label: "Методология закупок 2.0",
    type: "CHAT",
    category: "Закупки",
    deployment: "local",
    baseRequests: 2980,
    weight: 0.22,
  },
  {
    id: "translator",
    label: "Переводчик",
    type: "TASK",
    category: "RUS",
    deployment: "local",
    baseRequests: 2540,
    weight: 0.19,
  },
  {
    id: "legal-npa-3",
    label: "Юридический консультант НПА 3.0",
    type: "ANALYSIS",
    category: "НПА",
    deployment: "local",
    baseRequests: 2120,
    weight: 0.16,
  },
  {
    id: "vnd-sk-3",
    label: "ВНД агент Самрук-Қазына 3.0",
    type: "ANALYSIS",
    category: "ВНД",
    deployment: "local",
    baseRequests: 1840,
    weight: 0.14,
  },
  {
    id: "legal-npa-sk",
    label: "Юридический консультант НПА Самрук-Казына",
    type: "ANALYSIS",
    category: "НПА",
    deployment: "external",
    baseRequests: 1560,
    weight: 0.12,
  },
  {
    id: "finance-models",
    label: "Агент по финансовым моделям",
    type: "ANALYSIS",
    category: "Финансы",
    deployment: "local",
    baseRequests: 1280,
    weight: 0.1,
  },
  {
    id: "limits-calc-2",
    label: "Агент для расчета лимитов 2.0",
    type: "TASK",
    category: "Excel",
    deployment: "local",
    baseRequests: 980,
    weight: 0.08,
  },
];

const AGENT_OPTIONS = [
  { id: "all", label: "Все агенты", weight: 1 } as { id: string; label: string; weight: number },
  ...AI_STUDIO_AGENTS,
];

interface MetricDef {
  key: "page_visit" | "agent_open" | "agent_message" | "agent_feedback_like" | "agent_feedback_dislike";
  label: string;
  shortLabel: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const METRIC_DEFS: MetricDef[] = [
  {
    key: "page_visit",
    label: "Посещение страницы",
    shortLabel: "Посещения",
    color: "hsl(217, 91%, 60%)",
    icon: MousePointerClick,
  },
  {
    key: "agent_open",
    label: "Открытие агента",
    shortLabel: "Открытия",
    color: "hsl(174, 72%, 45%)",
    icon: Eye,
  },
  {
    key: "agent_message",
    label: "Сообщение агенту",
    shortLabel: "Сообщения",
    color: "hsl(35, 50%, 42%)",
    icon: MessageSquare,
  },
  {
    key: "agent_feedback_like",
    label: "Лайк ответа",
    shortLabel: "Лайки",
    color: "hsl(142, 71%, 45%)",
    icon: ThumbsUp,
  },
  {
    key: "agent_feedback_dislike",
    label: "Дизлайк ответа",
    shortLabel: "Дизлайки",
    color: "hsl(0, 84%, 60%)",
    icon: ThumbsDown,
  },
];

interface ActivityRow {
  date: string;
  iso: string;
  page_visit: number;
  agent_open: number;
  agent_message: number;
  agent_feedback_like: number;
  agent_feedback_dislike: number;
  users: number;
  tokens: number;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
}

function generateActivity(days: number, factor = 1, agentWeight = 1): ActivityRow[] {
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    const dow = d.getDay();
    const weekend = dow === 0 || dow === 6;
    const baseRequests = 380 + Math.sin(i / 4) * 80 + i * 4;
    const noise = (Math.sin(i * 1.7) + Math.cos(i * 0.9)) * 30;
    const dayMul = (weekend ? 0.35 : 1) * factor * agentWeight;

    const page_visit = Math.max(60, Math.round((baseRequests + noise) * 1.4 * dayMul));
    const agent_open = Math.max(30, Math.round(page_visit * 0.55));
    const agent_message = Math.max(20, Math.round(agent_open * 0.85));
    const agent_feedback_like = Math.max(2, Math.round(agent_message * 0.18));
    const agent_feedback_dislike = Math.max(
      0,
      Math.round(agent_message * 0.04 + Math.sin(i * 0.7) * 2),
    );
    const users = Math.max(8, Math.round(agent_message / 9 + (weekend ? 0 : 5)));
    const tokens = Math.round(agent_message * (320 + Math.sin(i / 3) * 60));

    return {
      date: fmtDate(d),
      iso: d.toISOString().slice(0, 10),
      page_visit,
      agent_open,
      agent_message,
      agent_feedback_like,
      agent_feedback_dislike,
      users,
      tokens,
    };
  });
}

interface AgentStat {
  id: string;
  name: string;
  requests: number;
  type: AIAgentType;
  category: string;
  deployment: "local" | "external";
}

const AI_STUDIO_AGENT_STATS: AgentStat[] = AI_STUDIO_AGENTS.map((agent) => ({
  id: agent.id,
  name: agent.label,
  requests: agent.baseRequests,
  type: agent.type,
  category: agent.category,
  deployment: agent.deployment,
}));

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
    agent: "HR-Ассистент Самрука",
    verdict: "CORRECT" as const,
    text: "Корректный ответ по методологии, учтены все требования.",
    time: "10 мин назад",
  },
  {
    id: 2,
    user: "analyst_demo",
    agent: "Финансовый аналитик",
    verdict: "PARTIALLY_CORRECT" as const,
    text: "Требуется уточнение формулировки в пункте ответа.",
    time: "32 мин назад",
  },
  {
    id: 3,
    user: "lawyer_demo",
    agent: "Юридический ассистент",
    verdict: "CORRECT" as const,
    text: "Структура ответа удобна для использования.",
    time: "1 ч назад",
  },
  {
    id: 4,
    user: "support_qa",
    agent: "Технологический помощник",
    verdict: "INCORRECT" as const,
    text: "Указанная в ответе версия библиотеки устарела.",
    time: "2 ч назад",
  },
  {
    id: 5,
    user: "demo_user",
    agent: "Корпоративная База знаний",
    verdict: "CORRECT" as const,
    text: "Положительная оценка: документ найден корректно.",
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
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
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
          <span className="text-foreground font-medium">{p.name}:</span>
          <span className="text-foreground tabular-nums">
            {Number(p.value).toLocaleString("ru-RU")}
          </span>
        </p>
      ))}
    </div>
  );
}

function buildReportHtml(args: {
  title: string;
  subtitle: string;
  scopeLabel: string;
  companyLabel: string;
  agentLabel: string;
  period: string;
  totalUsers: number;
  totalPageVisits: number;
  totalAgentMessages: number;
  totalDislikes: number;
  totalLikes: number;
  totalAgentOpens: number;
  activity: ActivityRow[];
  topAgents: typeof AI_STUDIO_AGENT_STATS;
  topUsers: typeof TOP_USERS;
  recentFeedback: typeof RECENT_FEEDBACK;
  forPrint?: boolean;
}) {
  const {
    title,
    subtitle,
    scopeLabel,
    companyLabel,
    agentLabel,
    period,
    totalUsers,
    totalPageVisits,
    totalAgentMessages,
    totalDislikes,
    totalLikes,
    totalAgentOpens,
    activity,
    topAgents,
    topUsers,
    recentFeedback,
    forPrint,
  } = args;

  const fmt = (n: number) => n.toLocaleString("ru-RU");
  const generated = new Date().toLocaleString("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  });

  const css = `
    body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; padding: 24px; }
    h1 { color: #A17436; margin: 0 0 4px 0; font-size: 22px; }
    h2 { color: #1f2937; margin: 24px 0 8px 0; font-size: 16px; border-bottom: 2px solid #A17436; padding-bottom: 4px; }
    p, li { font-size: 12px; line-height: 1.5; }
    .meta { color: #6b7280; font-size: 11px; margin-bottom: 16px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 12px; }
    .kpi { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; }
    .kpi-label { color: #6b7280; font-size: 10px; text-transform: uppercase; letter-spacing: 0.04em; }
    .kpi-value { font-size: 22px; font-weight: bold; color: #111827; margin-top: 4px; }
    .kpi-hint { color: #6b7280; font-size: 10px; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11px; }
    th, td { border: 1px solid #e5e7eb; padding: 6px 8px; text-align: left; }
    th { background: #f3f4f6; font-weight: 600; }
    tr:nth-child(even) td { background: #fafafa; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; }
    .badge-correct { background: #ecfdf5; color: #059669; }
    .badge-partial { background: #fffbeb; color: #b45309; }
    .badge-incorrect { background: #fef2f2; color: #b91c1c; }
    .filter-row { background: #fafafa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; margin: 12px 0 8px; font-size: 11px; }
    .filter-row strong { color: #111827; }
    @media print { body { padding: 12px; } }
  `;

  const verdictBadge = (v: keyof typeof VERDICT_STYLES) => {
    if (v === "CORRECT") return '<span class="badge badge-correct">Верно</span>';
    if (v === "PARTIALLY_CORRECT")
      return '<span class="badge badge-partial">Частично</span>';
    return '<span class="badge badge-incorrect">Неверно</span>';
  };

  const printBtn = forPrint
    ? `<div style="margin-bottom:16px"><button onclick="window.print()" style="padding:8px 14px;background:#A17436;color:#fff;border:0;border-radius:6px;cursor:pointer;font-weight:600">Скачать PDF / Распечатать</button></div>`
    : "";

  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title>${title} — AI-HUB · ${period}</title>
  <style>${css}</style>
</head>
<body>
  ${printBtn}
  <h1>AI-HUB · ${title}</h1>
  <p class="meta">${subtitle} · сформировано ${generated}</p>

  <div class="filter-row">
    <strong>Период:</strong> ${period} ·
    <strong>Скоуп:</strong> ${scopeLabel} ·
    <strong>Компания:</strong> ${companyLabel} ·
    <strong>Агент:</strong> ${agentLabel}
  </div>

  <h2>Ключевые показатели</h2>
  <div class="kpi-grid">
    <div class="kpi">
      <div class="kpi-label">Пользователей</div>
      <div class="kpi-value">${fmt(totalUsers)}</div>
      <div class="kpi-hint">unique_users за период</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Посещения страницы</div>
      <div class="kpi-value">${fmt(totalPageVisits)}</div>
      <div class="kpi-hint">page_visit</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Сообщения агенту</div>
      <div class="kpi-value">${fmt(totalAgentMessages)}</div>
      <div class="kpi-hint">agent_message</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Дизлайки ответа</div>
      <div class="kpi-value">${fmt(totalDislikes)}</div>
      <div class="kpi-hint">agent_feedback_dislike</div>
    </div>
  </div>

  <h2>Сводно по типам взаимодействий</h2>
  <table>
    <tr><th>Тип события</th><th>Описание</th><th>Всего</th></tr>
    <tr><td>page_visit</td><td>Посещение страницы (клик по платформе/агенту)</td><td>${fmt(totalPageVisits)}</td></tr>
    <tr><td>agent_open</td><td>Открытие карточки агента</td><td>${fmt(totalAgentOpens)}</td></tr>
    <tr><td>agent_message</td><td>Сообщение агенту за период</td><td>${fmt(totalAgentMessages)}</td></tr>
    <tr><td>agent_feedback_like</td><td>Лайк ответа</td><td>${fmt(totalLikes)}</td></tr>
    <tr><td>agent_feedback_dislike</td><td>Дизлайк ответа</td><td>${fmt(totalDislikes)}</td></tr>
  </table>

  <h2>Динамика по дням</h2>
  <table>
    <tr>
      <th>Дата</th>
      <th>Посещения</th>
      <th>Открытия агента</th>
      <th>Сообщения</th>
      <th>Лайки</th>
      <th>Дизлайки</th>
      <th>Польз.</th>
    </tr>
    ${activity
      .map(
        (r) => `
        <tr>
          <td>${r.iso}</td>
          <td>${r.page_visit}</td>
          <td>${r.agent_open}</td>
          <td>${r.agent_message}</td>
          <td>${r.agent_feedback_like}</td>
          <td>${r.agent_feedback_dislike}</td>
          <td>${r.users}</td>
        </tr>`,
      )
      .join("")}
  </table>

  <h2>Топ AI-агентов AI Studio</h2>
  <table>
    <tr><th>#</th><th>Название</th><th>Тип</th><th>Запросов</th></tr>
    ${topAgents
      .map(
        (a, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${a.name}</td>
          <td>${a.type}</td>
          <td>${fmt(a.requests)}</td>
        </tr>`,
      )
      .join("")}
  </table>

  <h2>Самые активные пользователи</h2>
  <table>
    <tr><th>#</th><th>Пользователь</th><th>Логин</th><th>Департамент</th><th>Запросов</th></tr>
    ${topUsers
      .map(
        (u, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${u.name}</td>
          <td>${u.login}</td>
          <td>${u.department}</td>
          <td>${u.requests}</td>
        </tr>`,
      )
      .join("")}
  </table>

  <h2>Последние отзывы</h2>
  <table>
    <tr><th>Пользователь</th><th>Агент</th><th>Оценка</th><th>Комментарий</th><th>Время</th></tr>
    ${recentFeedback
      .map(
        (f) => `
        <tr>
          <td>${f.user}</td>
          <td>${f.agent}</td>
          <td>${verdictBadge(f.verdict)}</td>
          <td>${f.text}</td>
          <td>${f.time}</td>
        </tr>`,
      )
      .join("")}
  </table>

  <p class="meta" style="margin-top:24px">Документ сформирован прототипом AI-HUB. Данные приведены для демонстрации UI/UX.</p>
</body>
</html>`;
}

export default function Analytics() {
  const { role, getScope } = useAdminRole();
  const [period, setPeriod] = useState<Period>("30d");
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [selectedAgent, setSelectedAgent] = useState<string>("all");

  const scope = getScope("analytics");
  const isCompanyScope = scope === "company";
  const isDepartmentScope = scope === "department";
  const isAllScope = scope === "all";

  const headerCopy = useMemo(() => {
    if (isAllScope) {
      return {
        title: "Обзор платформы",
        subtitle:
          "Ключевые показатели использования AI-HUB по всем компаниям группы Самрук-Қазына",
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
  const agentWeight =
    AGENT_OPTIONS.find((a) => a.id === selectedAgent)?.weight ?? 1;

  const activity = useMemo(
    () => generateActivity(days, factor, agentWeight),
    [days, factor, agentWeight],
  );

  const totals = useMemo(() => {
    const sum = (k: keyof ActivityRow) =>
      activity.reduce((s, x) => s + (x[k] as number), 0);
    return {
      pageVisits: sum("page_visit"),
      agentOpens: sum("agent_open"),
      agentMessages: sum("agent_message"),
      likes: sum("agent_feedback_like"),
      dislikes: sum("agent_feedback_dislike"),
      tokens: sum("tokens"),
      avgUsers: Math.round(sum("users") / activity.length),
    };
  }, [activity]);

  const totalUsersDisplayed = isAllScope
    ? Math.round(247 * selectedCompanyFactor * agentWeight)
    : isCompanyScope
      ? Math.round(112 * agentWeight)
      : Math.round(14 * agentWeight);

  const topAgents = useMemo<AgentStat[]>(() => {
    if (selectedAgent === "all") {
      return isDepartmentScope
        ? AI_STUDIO_AGENT_STATS.slice(0, 4)
        : AI_STUDIO_AGENT_STATS;
    }
    const found = AI_STUDIO_AGENTS.find((a) => a.id === selectedAgent);
    if (!found) return AI_STUDIO_AGENT_STATS;
    return [
      {
        id: found.id,
        name: found.label,
        requests: found.baseRequests,
        type: found.type,
        category: found.category,
        deployment: found.deployment,
      },
    ];
  }, [selectedAgent, isDepartmentScope]);

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
        {
          label: `Токены (${period})`,
          value: `${(totals.tokens / 1_000_000).toFixed(1)}M`,
          icon: Cpu,
        },
      ];
    }
    if (isCompanyScope) {
      return [
        { label: "Департаментов", value: "6", icon: Users },
        { label: "Сотрудников", value: "84", icon: UserCheck },
        { label: "Базы знаний", value: "12", icon: BookOpen },
        {
          label: `Токены (${period})`,
          value: `${(totals.tokens / 1_000).toFixed(0)}K`,
          icon: Cpu,
        },
      ];
    }
    return [
      { label: "Сотрудников", value: "14", icon: UserCheck },
      { label: "AI-агентов", value: "5", icon: Brain },
      { label: "Базы знаний", value: "4", icon: BookOpen },
      {
        label: `Токены (${period})`,
        value: `${(totals.tokens / 1_000).toFixed(0)}K`,
        icon: Cpu,
      },
    ];
  }, [isAllScope, isCompanyScope, period, totals.tokens]);

  const companyLabel =
    COMPANY_OPTIONS.find((c) => c.id === selectedCompany)?.label ?? "—";
  const agentLabel =
    AGENT_OPTIONS.find((a) => a.id === selectedAgent)?.label ?? "—";

  const reportArgs = {
    title: headerCopy.title,
    subtitle: headerCopy.subtitle,
    scopeLabel: headerCopy.scopeLabel,
    companyLabel,
    agentLabel,
    period,
    totalUsers: totalUsersDisplayed,
    totalPageVisits: totals.pageVisits,
    totalAgentMessages: totals.agentMessages,
    totalDislikes: totals.dislikes,
    totalLikes: totals.likes,
    totalAgentOpens: totals.agentOpens,
    activity,
    topAgents,
    topUsers,
    recentFeedback: RECENT_FEEDBACK,
  };

  const baseFileName = `analytics-${role.id.toLowerCase()}-${period}-${selectedCompany}-${selectedAgent}`;

  const handleExportExcel = () => {
    const fmtNum = (n: number) => n.toString();

    const sections: string[] = [];

    sections.push(`AI-HUB · ${headerCopy.title}`);
    sections.push(`Период;${period}`);
    sections.push(`Скоуп;${headerCopy.scopeLabel}`);
    sections.push(`Компания;${companyLabel}`);
    sections.push(`Агент;${agentLabel}`);
    sections.push("");

    sections.push("Ключевые показатели");
    sections.push("Метрика;Значение");
    sections.push(`Пользователей (unique_users);${totalUsersDisplayed}`);
    sections.push(`Посещения страницы (page_visit);${totals.pageVisits}`);
    sections.push(`Открытия агента (agent_open);${totals.agentOpens}`);
    sections.push(`Сообщения агенту (agent_message);${totals.agentMessages}`);
    sections.push(`Лайки ответа (agent_feedback_like);${totals.likes}`);
    sections.push(`Дизлайки ответа (agent_feedback_dislike);${totals.dislikes}`);
    sections.push("");

    sections.push("Динамика по дням");
    sections.push("Дата;Посещения;Открытия агента;Сообщения;Лайки;Дизлайки;Пользователи");
    activity.forEach((r) =>
      sections.push(
        [
          r.iso,
          r.page_visit,
          r.agent_open,
          r.agent_message,
          r.agent_feedback_like,
          r.agent_feedback_dislike,
          r.users,
        ]
          .map(fmtNum)
          .join(";"),
      ),
    );
    sections.push("");

    sections.push("Топ AI-агентов Самрука");
    sections.push("#;Название;Тип;Запросов");
    topAgents.forEach((a, i) =>
      sections.push([i + 1, a.name, a.type, a.requests].join(";")),
    );
    sections.push("");

    sections.push("Топ пользователей");
    sections.push("#;Пользователь;Логин;Департамент;Запросов");
    topUsers.forEach((u, i) =>
      sections.push(
        [i + 1, u.name, u.login, u.department, u.requests].join(";"),
      ),
    );
    sections.push("");

    sections.push("Последние отзывы");
    sections.push("Пользователь;Агент;Оценка;Комментарий;Время");
    RECENT_FEEDBACK.forEach((f) =>
      sections.push(
        [
          f.user,
          f.agent,
          VERDICT_STYLES[f.verdict].label,
          `"${f.text.replace(/"/g, '""')}"`,
          f.time,
        ].join(";"),
      ),
    );

    const csv = sections.join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseFileName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportWord = () => {
    const html = buildReportHtml(reportArgs);
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseFileName}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    const html = buildReportHtml({ ...reportArgs, forPrint: true });
    const printWindow = window.open("", "_blank", "width=900,height=1200");
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
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
                className="h-9 rounded-md border border-input bg-background pl-3 pr-8 py-1.5 text-sm appearance-none min-w-[180px]"
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
          <div className="relative">
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="h-9 rounded-md border border-input bg-background pl-3 pr-8 py-1.5 text-sm appearance-none min-w-[180px]"
              aria-label="Фильтр по агенту"
            >
              {AGENT_OPTIONS.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleExportExcel}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleExportWord}
          >
            <FileText className="h-4 w-4" />
            Word
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleExportPdf}
          >
            <Download className="h-4 w-4" />
            PDF
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
          label="Пользователей"
          value={totalUsersDisplayed.toLocaleString("ru-RU")}
          delta={12.4}
          icon={UserCheck}
          hint="unique_users"
          accent="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
        />
        <Kpi
          label="Посещения страницы"
          value={totals.pageVisits.toLocaleString("ru-RU")}
          delta={8.7}
          icon={MousePointerClick}
          hint="page_visit"
          accent="bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30"
        />
        <Kpi
          label="Сообщения агенту"
          value={totals.agentMessages.toLocaleString("ru-RU")}
          delta={5.6}
          icon={MessageSquare}
          hint="agent_message"
          accent="bg-[#A17436]/10 text-[#A17436] border-[#A17436]/30"
        />
        <Kpi
          label="Дизлайки ответа"
          value={totals.dislikes.toLocaleString("ru-RU")}
          delta={-3.2}
          icon={ThumbsDown}
          hint="agent_feedback_dislike"
          accent="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30"
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
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Динамика по типам взаимодействий
            </h2>
            <p className="text-xs text-muted-foreground">
              Посещения, открытия, сообщения, лайки и дизлайки по дням
            </p>
          </div>
        </div>
        <div className="h-80 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activity}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
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
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                iconType="circle"
              />
              {METRIC_DEFS.map((m) => (
                <Line
                  key={m.key}
                  type="monotone"
                  dataKey={m.key}
                  name={m.label}
                  stroke={m.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 bg-card border-border lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Топ AI-агенты AI Studio
              </h2>
              <p className="text-xs text-muted-foreground">
                {selectedAgent === "all"
                  ? "По количеству запросов за период"
                  : `Только: ${agentLabel}`}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              всего{" "}
              {topAgents
                .reduce((s, a) => s + a.requests, 0)
                .toLocaleString("ru-RU")}
            </span>
          </div>
          <div className="space-y-2.5">
            {(() => {
              const maxRequests = Math.max(...topAgents.map((a) => a.requests), 1);
              return topAgents.map((agent, i) => {
                const pct = (agent.requests / maxRequests) * 100;
                return (
                  <div
                    key={agent.id ?? agent.name}
                    className="group flex items-center gap-3 p-2.5 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <span className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#A17436]/10 text-[#A17436] text-xs font-semibold tabular-nums">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="text-sm font-medium text-foreground truncate">
                          {agent.name}
                        </p>
                        <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted/80 text-muted-foreground border border-border">
                          {agent.category}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border",
                            agent.deployment === "local"
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                              : "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30",
                          )}
                        >
                          {agent.deployment === "local" ? "Локальный" : "Внешний"}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#A17436] transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-foreground tabular-nums">
                        {agent.requests.toLocaleString("ru-RU")}
                      </p>
                      <p className="text-[10px] text-muted-foreground">запросов</p>
                    </div>
                  </div>
                );
              });
            })()}
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
                <div
                  key={entry.name}
                  className="flex items-center gap-2 text-xs"
                >
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ background: entry.color }}
                  />
                  <span className="flex-1 text-foreground truncate">
                    {entry.name}
                  </span>
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
              <p className="text-xs text-muted-foreground">
                Распределение оценок
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {FEEDBACK_DISTRIBUTION.map((f) => (
              <div key={f.name}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-foreground">{f.name}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {f.value}%
                  </span>
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
                <p className="text-xs text-muted-foreground">Лайков</p>
                <p className="text-sm font-semibold tabular-nums">
                  {totals.likes.toLocaleString("ru-RU")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-500/10 text-red-600 dark:text-red-400">
                <ThumbsDown className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Дизлайков</p>
                <p className="text-sm font-semibold tabular-nums">
                  {totals.dislikes.toLocaleString("ru-RU")}
                </p>
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
                      <span className="font-medium text-foreground">
                        {f.user}
                      </span>
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
              <p className="text-xs text-muted-foreground">
                По количеству запросов
              </p>
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
        Данные приведены под ролью «{role.label}» ·{" "}
        {headerCopy.scopeLabel.toLowerCase()} · компания: {companyLabel} · агент:{" "}
        {agentLabel}
      </p>
    </div>
  );
}
