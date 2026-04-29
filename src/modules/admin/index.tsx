import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import Analytics from "./pages/Analytics";
import Monitoring from "./pages/Monitoring";
import AlertmanagerOverview from "./pages/DashboardView/AlertmanagerOverview";
import Users from "./pages/Users/index";
import LLMModels from "./pages/LLMModels/index";
import AIAgents from "./pages/AIAgents/index";
import System from "./pages/System/index";
import Knowledge from "./pages/Knowledge";
import Reports from "./pages/Reports/index";
import Companies from "./pages/Companies/index";
import Departments from "./pages/Departments/index";
import { AdminRoleProvider } from "@/contexts/AdminRoleContext";
import { RoleGuardedRoute } from "./components/RoleGuardedRoute";
import { NoAccess } from "./components/NoAccess";
import { AdminDefaultRedirect } from "./components/AdminDefaultRedirect";

export default function AdminApp() {
  return (
    <AdminRoleProvider>
      <AdminLayout>
        <Routes>
          <Route
            path="analytics"
            element={
              <RoleGuardedRoute permission="analytics">
                <Analytics />
              </RoleGuardedRoute>
            }
          />
          <Route
            path="monitoring"
            element={
              <RoleGuardedRoute permission="monitoring">
                <Monitoring />
              </RoleGuardedRoute>
            }
          />
          <Route
            path="monitoring/alertmanager"
            element={
              <RoleGuardedRoute permission="monitoring">
                <AlertmanagerOverview />
              </RoleGuardedRoute>
            }
          />
          <Route path="dashboard" element={<Navigate to="/admin/analytics" replace />} />
          <Route
            path="dashboard/alertmanager"
            element={<Navigate to="/admin/monitoring/alertmanager" replace />}
          />
          <Route
            path="users"
            element={
              <RoleGuardedRoute permission="users">
                <Users />
              </RoleGuardedRoute>
            }
          />
          <Route
            path="llm-models"
            element={
              <RoleGuardedRoute permission="llmModels">
                <LLMModels />
              </RoleGuardedRoute>
            }
          />
          <Route
            path="ai-agents"
            element={
              <RoleGuardedRoute permission="viewAIAgents">
                <AIAgents />
              </RoleGuardedRoute>
            }
          />
          <Route
            path="knowledge"
            element={
              <RoleGuardedRoute permission="viewKnowledge">
                <Knowledge />
              </RoleGuardedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <RoleGuardedRoute permission="reports">
                <Reports />
              </RoleGuardedRoute>
            }
          />
          <Route
            path="companies"
            element={
              <RoleGuardedRoute permission="companies">
                <Companies />
              </RoleGuardedRoute>
            }
          />
          <Route
            path="departments"
            element={
              <RoleGuardedRoute permission="departments">
                <Departments />
              </RoleGuardedRoute>
            }
          />
          <Route
            path="system"
            element={
              <RoleGuardedRoute permission="llmModels">
                <System />
              </RoleGuardedRoute>
            }
          />
          <Route path="no-access" element={<NoAccess />} />
          <Route path="" element={<AdminDefaultRedirect />} />
          <Route path="*" element={<AdminDefaultRedirect />} />
        </Routes>
      </AdminLayout>
    </AdminRoleProvider>
  );
}
