import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AIStudio from "./pages/AIStudio";
import AIStudioChat from "./pages/AIStudioChat";
import History from "./pages/History";
import HistoryChat from "./pages/HistoryChat";
import Projects from "./pages/Projects";
import ProjectChat from "./pages/ProjectChat";
import Lab from "./pages/Lab";
import Laboratory2 from "./pages/Laboratory2";
import Developer from "./pages/Developer";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/Layout";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Routes, Route } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ai-studio" element={<AIStudio />} />
                    <Route path="/ai-studio-chat" element={<AIStudioChat />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/history-chat/:id" element={<HistoryChat />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/project-chat" element={<ProjectChat />} />
                    <Route path="/lab" element={<Lab />} />
                    <Route path="/laboratory2" element={<Laboratory2 />} />
                    <Route path="/developer" element={<Developer />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
