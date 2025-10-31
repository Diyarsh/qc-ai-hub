import { DataTable, Column } from "@/shared/components/Table/DataTable";
import { Badge } from "@/shared/components/Badge";

interface Route {
  id: string;
  uri: string;
  order: number;
  predicates: string[];
  filters: string[];
  status: "UP" | "DOWN";
}

const mockRoutes: Route[] = [
  {
    id: "agentservice",
    uri: "http://agentservice:8081",
    order: 1,
    predicates: ["Path=/api/ai-agents/**"],
    filters: ["RewritePath=/api/ai-agents/(?<segment>.*), /${segment}"],
    status: "UP",
  },
  {
    id: "documentservice",
    uri: "http://documentservice:8084",
    order: 2,
    predicates: ["Path=/api/documents/**"],
    filters: ["RewritePath=/api/documents/(?<segment>.*), /${segment}"],
    status: "UP",
  },
  {
    id: "chatservice",
    uri: "http://chatservice:8082",
    order: 3,
    predicates: ["Path=/api/chat/**"],
    filters: ["RewritePath=/api/chat/(?<segment>.*), /${segment}"],
    status: "UP",
  },
  {
    id: "llmrouter",
    uri: "http://llmrouter:8083",
    order: 4,
    predicates: ["Path=/api/llm/**"],
    filters: ["RewritePath=/api/llm/(?<segment>.*), /${segment}"],
    status: "UP",
  },
  {
    id: "semanticcontextservice",
    uri: "http://semanticcontextservice:8085",
    order: 5,
    predicates: ["Path=/api/semantic/**"],
    filters: ["RewritePath=/api/semantic/(?<segment>.*), /${segment}"],
    status: "UP",
  },
];

export function Gateway() {
  const columns: Column<Route>[] = [
    { key: "id", label: "Route ID", sortable: true },
    { key: "uri", label: "Target URI" },
    { key: "order", label: "Order", sortable: true },
    {
      key: "predicates",
      label: "Predicates",
      render: (value) => (
        <div className="text-xs font-mono">{Array.isArray(value) ? value.join(", ") : String(value)}</div>
      ),
    },
    {
      key: "filters",
      label: "Filters",
      render: (value) => (
        <div className="text-xs font-mono">{Array.isArray(value) ? value.join(", ") : String(value)}</div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (_, row) => (
        <Badge variant={row.status === "UP" ? "success" : "error"}>{row.status}</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={mockRoutes} />
    </div>
  );
}

