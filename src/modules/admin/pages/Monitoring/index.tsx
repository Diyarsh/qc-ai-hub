import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  LayoutGrid,
  List,
  Search,
  ChevronDown,
  ChevronRight,
  Activity,
  Server,
  Database,
  AlertTriangle,
  CheckCircle2,
  Star,
  Cpu,
  HardDrive,
  Network,
  Layers,
  Clock,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface DashboardItem {
  id: string;
  name: string;
  tags: string[];
  starred?: boolean;
  category: string;
  viewPath?: string;
}

const mockDashboards: DashboardItem[] = [
  { id: "1", name: "Alertmanager / Overview", tags: ["alertmanager-mixin"], category: "Shared with me", viewPath: "/admin/monitoring/alertmanager" },
  { id: "2", name: "CoreDNS", tags: ["coredns", "dns"], category: "Shared with me" },
  { id: "3", name: "etcd", tags: ["etcd-mixin"], category: "Shared with me" },
  { id: "4", name: "Grafana Overview", tags: [], category: "Grafana Overview", starred: true },
  { id: "5", name: "Kubernetes / API server", tags: ["kubernetes-mixin"], category: "Grafana Overview" },
  { id: "6", name: "Kubernetes / Compute Resources / Multi-Cluster", tags: ["kubernetes-mixin"], category: "Grafana Overview" },
  { id: "7", name: "Kubernetes / Compute Resources / Cluster", tags: ["kubernetes-mixin"], category: "Grafana Overview" },
  { id: "8", name: "Kubernetes / Compute Resources / Namespace (Pods)", tags: ["kubernetes-mixin"], category: "Grafana Overview" },
  { id: "9", name: "Kubernetes / Compute Resources / Namespace (Workloads)", tags: ["kubernetes-mixin"], category: "Grafana Overview" },
  { id: "10", name: "Kubernetes / Compute Resources / Node (Pods)", tags: ["kubernetes-mixin"], category: "Grafana Overview" },
  { id: "11", name: "Kubernetes / Compute Resources / Pod", tags: ["kubernetes-mixin"], category: "Grafana Overview" },
  { id: "12", name: "Kubernetes / Compute Resources / Workload", tags: ["kubernetes-mixin"], category: "Grafana Overview" },
  { id: "13", name: "Kubernetes / Controller Manager", tags: ["kubernetes-mixin"], category: "Grafana Overview" },
  { id: "14", name: "Kubernetes / Kubelet", tags: ["kubernetes-mixin"], category: "Grafana Overview" },
  { id: "15", name: "Kubernetes / Networking / Cluster", tags: ["kubernetes-mixin"], category: "Grafana Overview" },
  { id: "16", name: "Kubernetes / Networking / Namespace (Pods)", tags: ["kubernetes-mixin"], category: "Grafana Overview" },
  { id: "17", name: "Kubernetes / Networking / Namespace (Workload)", tags: ["kubernetes-mixin"], category: "Grafana Overview" },
  { id: "18", name: "Kubernetes / Networking / Pod", tags: ["kubernetes-mixin"], category: "Grafana Overview" },
  { id: "19", name: "Kubernetes / Networking / Workload", tags: ["kubernetes-mixin"], category: "Grafana Overview" },
  { id: "20", name: "Kubernetes / Persistent Volumes", tags: ["kubernetes-mixin"], category: "Grafana Overview" },
  { id: "21", name: "Kubernetes / Proxy", tags: ["kubernetes-mixin"], category: "Grafana Overview" },
  { id: "22", name: "Kubernetes / Scheduler", tags: ["kubernetes-mixin"], category: "Grafana Overview" },
  { id: "23", name: "Node Exporter / AIX", tags: ["node-exporter-mixin"], category: "Grafana Overview" },
  { id: "24", name: "Node Exporter / MacOS", tags: ["node-exporter-mixin"], category: "Grafana Overview" },
  { id: "25", name: "Node Exporter / Nodes", tags: ["node-exporter-mixin"], category: "Grafana Overview" },
  { id: "26", name: "Node Exporter / USE Method / Cluster", tags: ["node-exporter-mixin"], category: "Grafana Overview" },
  { id: "27", name: "Node Exporter / USE Method / Node", tags: ["node-exporter-mixin"], category: "Grafana Overview" },
  { id: "28", name: "Prometheus / Overview", tags: ["prometheus-mixin"], category: "Grafana Overview" },
  { id: "29", name: "Spring Boot Observability", tags: [], category: "Grafana Overview" },
];

const allTags = Array.from(new Set(mockDashboards.flatMap((d) => d.tags)));

const tagColors: Record<string, string> = {
  "alertmanager-mixin": "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
  "coredns": "bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30",
  "dns": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  "etcd-mixin": "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  "kubernetes-mixin": "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
  "node-exporter-mixin": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  "prometheus-mixin": "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
};

function getTagClass(tag: string) {
  return tagColors[tag] ?? "bg-primary/10 text-primary border-primary/20";
}

interface ClusterStat {
  label: string;
  value: string;
  hint: string;
  status: "ok" | "warn" | "critical";
  icon: React.ComponentType<{ className?: string }>;
}

const CLUSTER_STATS: ClusterStat[] = [
  { label: "Кластер", value: "Healthy", hint: "3 ноды · 142 пода", status: "ok", icon: Server },
  { label: "CPU", value: "42%", hint: "16 / 38 cores", status: "ok", icon: Cpu },
  { label: "Память", value: "68%", hint: "84 / 124 GiB", status: "warn", icon: HardDrive },
  { label: "Активные алерты", value: "2", hint: "1 warning · 1 critical", status: "warn", icon: AlertTriangle },
];

const STATUS_STYLES = {
  ok: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  warn: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
  critical: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
};

export default function Monitoring() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [starredOnly, setStarredOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "recent">("name");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const filtered = mockDashboards.filter((d) => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase());
    const matchStarred = !starredOnly || d.starred;
    const matchTag = !filterTag || d.tags.includes(filterTag);
    return matchSearch && matchStarred && matchTag;
  });

  const sorted = [...filtered].sort((a, b) => (sortBy === "name" ? a.name.localeCompare(b.name) : 0));

  const byCategory = useMemo(
    () =>
      sorted.reduce<Record<string, DashboardItem[]>>((acc, d) => {
        if (!acc[d.category]) acc[d.category] = [];
        acc[d.category].push(d);
        return acc;
      }, {}),
    [sorted],
  );
  const categories = Object.keys(byCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            Мониторинг инфраструктуры
          </h1>
          <p className="mt-1 text-muted-foreground">
            Grafana и Prometheus дашборды кластера AI-HUB
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-muted-foreground">Prometheus</span>
            <span className="font-medium text-foreground">подключён</span>
          </span>
          <Button variant="outline" size="sm" className="gap-2">
            <Clock className="h-4 w-4" />
            Last 1 hour
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CLUSTER_STATS.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-4 bg-card border-border">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </p>
                  <p className="mt-1.5 text-xl font-semibold text-foreground tabular-nums">
                    {s.value}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground truncate">{s.hint}</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg border",
                    STATUS_STYLES[s.status],
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-4 bg-card border-border">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск дашбордов и папок"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={filterTag ?? ""}
                onChange={(e) => setFilterTag(e.target.value || null)}
                className="h-9 rounded-md border border-input bg-background px-3 py-1.5 text-sm appearance-none pr-8"
              >
                <option value="">Все теги</option>
                {allTags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
              <input
                type="checkbox"
                checked={starredOnly}
                onChange={(e) => setStarredOnly(e.target.checked)}
                className="rounded border-input"
              />
              <Star className="h-3.5 w-3.5" />
              Избранные
            </label>
            <div className="flex rounded-md border border-input overflow-hidden">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode("list")}
                aria-label="Список"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode("grid")}
                aria-label="Сетка"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "recent")}
                className="h-9 rounded-md border border-input bg-background px-3 py-1.5 text-sm appearance-none pr-8"
              >
                <option value="name">Сортировка: Имя</option>
                <option value="recent">Сортировка: Недавние</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </Card>

      {viewMode === "list" ? (
        <Card className="bg-card border-border overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-3 border-b border-border bg-muted/30 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <div className="w-4" />
            <div>Название</div>
            <div>Теги</div>
          </div>
          {categories.map((cat) => (
            <Collapsible key={cat} defaultOpen className="group">
              <CollapsibleTrigger className="w-full grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2.5 border-b border-border hover:bg-muted/20 transition-colors cursor-pointer text-left">
                <ChevronRight className="h-4 w-4 text-muted-foreground self-center group-data-[state=open]:rotate-90 transition-transform" />
                <div className="font-medium text-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  {cat}
                  <span className="text-xs text-muted-foreground font-normal">
                    ({byCategory[cat].length})
                  </span>
                </div>
                <div />
              </CollapsibleTrigger>
              <CollapsibleContent>
                {byCategory[cat].map((d) => (
                  <div
                    key={d.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => d.viewPath && navigate(d.viewPath)}
                    onKeyDown={(e) =>
                      d.viewPath && (e.key === "Enter" || e.key === " ") && navigate(d.viewPath)
                    }
                    className={cn(
                      "grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2.5 pl-12 border-b border-border last:border-b-0 transition-colors items-center text-sm",
                      d.viewPath
                        ? "cursor-pointer hover:bg-muted/20"
                        : "cursor-default opacity-70",
                    )}
                  >
                    <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium text-foreground truncate">{d.name}</span>
                      {d.starred && (
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {d.tags.map((t) => (
                        <span
                          key={t}
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium border ${getTagClass(
                            t,
                          )}`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </Card>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Layers className="h-4 w-4" />
                {cat}
                <span className="text-xs">({byCategory[cat].length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {byCategory[cat].map((d) => (
                  <Card
                    key={d.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => d.viewPath && navigate(d.viewPath)}
                    onKeyDown={(e) =>
                      d.viewPath && (e.key === "Enter" || e.key === " ") && navigate(d.viewPath)
                    }
                    className={cn(
                      "p-4 bg-card border-border transition-colors",
                      d.viewPath
                        ? "cursor-pointer hover:bg-muted/30 hover:border-primary/40"
                        : "cursor-default opacity-70",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <LayoutGrid className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <p className="text-sm font-medium text-foreground truncate">{d.name}</p>
                          {d.starred && (
                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {d.tags.length > 0 ? (
                            d.tags.map((t) => (
                              <span
                                key={t}
                                className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium border ${getTagClass(
                                  t,
                                )}`}
                              >
                                {t}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-muted-foreground italic">без тегов</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
        <span>Подключено к Grafana / Prometheus стеку</span>
        <span className="opacity-50">·</span>
        <Network className="h-3.5 w-3.5" />
        <span>{mockDashboards.length} дашбордов доступно</span>
        <span className="opacity-50">·</span>
        <Database className="h-3.5 w-3.5" />
        <span>обновлено только что</span>
      </div>
    </div>
  );
}
