import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Search, ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DashboardItem {
  id: string;
  name: string;
  tags: string[];
  starred?: boolean;
  category?: string;
  viewPath?: string;
}

const mockDashboards: DashboardItem[] = [
  { id: "1", name: "Alertmanager / Overview", tags: ["alertmanager-mixin"], category: "Shared with me", viewPath: "/admin/dashboard/alertmanager" },
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
  "alertmanager-mixin": "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-400/50",
  "coredns": "bg-pink-500/20 text-pink-600 dark:text-pink-400 border-pink-400/50",
  "dns": "bg-green-500/20 text-green-600 dark:text-green-400 border-green-400/50",
  "etcd-mixin": "bg-red-500/20 text-red-600 dark:text-red-400 border-red-400/50",
  "kubernetes-mixin": "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-400/50",
  "node-exporter-mixin": "bg-green-500/20 text-green-600 dark:text-green-400 border-green-400/50",
  "prometheus-mixin": "bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/50",
};

function getTagClass(tag: string) {
  return tagColors[tag] ?? "bg-primary/10 text-primary border-primary/20";
}

export default function Dashboard() {
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

  const sorted = [...filtered].sort((a, b) =>
    sortBy === "name" ? a.name.localeCompare(b.name) : 0
  );

  const byCategory = sorted.reduce<Record<string, DashboardItem[]>>((acc, d) => {
    const cat = d.category ?? "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(d);
    return acc;
  }, {});
  const categories = Object.keys(byCategory);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Дашборды
        </h1>
        <p className="mt-1 text-muted-foreground">
          Создавайте и управляйте дашбордами для визуализации данных
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
              <option value="">Фильтр по тегу</option>
              {allTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={starredOnly}
              onChange={(e) => setStarredOnly(e.target.checked)}
              className="rounded border-input"
            />
            <span className="text-sm text-muted-foreground">Избранные</span>
          </label>
          <div className="flex rounded-md border border-input overflow-hidden">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("grid")}
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

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-3 border-b border-border bg-muted/30 text-sm font-medium text-foreground">
          <div className="w-4" />
          <div>Название</div>
          <div>Теги</div>
        </div>
        {categories.map((cat) => (
          <Collapsible key={cat} defaultOpen={true} className="group">
            <CollapsibleTrigger className="w-full grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 border-b border-border hover:bg-muted/20 transition-colors cursor-pointer text-left">
              <ChevronRight className="h-4 w-4 text-muted-foreground self-center group-data-[state=open]:rotate-90 transition-transform" />
              <div className="font-medium text-foreground">{cat}</div>
              <div />
            </CollapsibleTrigger>
            <CollapsibleContent>
              {byCategory[cat].map((d) => (
                <div
                  key={d.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => d.viewPath && navigate(d.viewPath)}
                  onKeyDown={(e) => d.viewPath && (e.key === "Enter" || e.key === " ") && navigate(d.viewPath)}
                  className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 pl-12 border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors cursor-pointer items-center text-sm"
                >
                  <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                  <div className="font-medium text-foreground">{d.name}</div>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {d.tags.map((t) => (
                      <span
                        key={t}
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border ${getTagClass(t)}`}
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
      </div>
    </div>
  );
}
