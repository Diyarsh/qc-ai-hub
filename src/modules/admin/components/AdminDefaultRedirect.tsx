import { Navigate } from "react-router-dom";
import {
  AdminPermissions,
  useAdminRole,
} from "@/contexts/AdminRoleContext";

const FALLBACK_ORDER: { permission: keyof AdminPermissions; path: string }[] = [
  { permission: "analytics", path: "analytics" },
  { permission: "monitoring", path: "monitoring" },
  { permission: "users", path: "users" },
  { permission: "viewAIAgents", path: "ai-agents" },
  { permission: "viewKnowledge", path: "knowledge" },
  { permission: "reports", path: "reports" },
  { permission: "departments", path: "departments" },
  { permission: "companies", path: "companies" },
  { permission: "llmModels", path: "llm-models" },
];

export function AdminDefaultRedirect() {
  const { hasAccess } = useAdminRole();
  const target = FALLBACK_ORDER.find((f) => hasAccess(f.permission));
  if (!target) {
    return <Navigate to="no-access" replace />;
  }
  return <Navigate to={target.path} replace />;
}
