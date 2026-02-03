import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users/index";
import LLMModels from "./pages/LLMModels/index";
import AIAgents from "./pages/AIAgents/index";
import System from "./pages/System/index";
import Knowledge from "./pages/Knowledge";
import Reports from "./pages/Reports/index";
import Companies from "./pages/Companies/index";
import Departments from "./pages/Departments/index";
import { useAuth } from "@/main/webapp/app/shared/hooks/useAuth";

export default function AdminApp() {
  // Для демо-прототипа временно отключаем проверку прав - все видят админку
  // const { isAdmin, isSuperAdmin, loading } = useAuth();
  // 
  // if (loading) {
  //   return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  // }
  // 
  // if (!isAdmin && !isSuperAdmin) {
  //   return <Navigate to="/dashboard" replace />;
  // }
  // 
  // const role = isSuperAdmin ? "ROLE_SUPER_ADMIN" : "ROLE_ADMIN";
  
  // Временно для демо - всем доступна админка
  const role = "ROLE_ADMIN";
  
  return (
    <AdminLayout role={role}>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="llm-models" element={<LLMModels />} />
        <Route path="ai-agents" element={<AIAgents />} />
        <Route path="knowledge" element={<Knowledge />} />
        <Route path="reports" element={<Reports />} />
        <Route path="companies" element={<Companies />} />
        <Route path="departments" element={<Departments />} />
        <Route path="system" element={<System />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
}
