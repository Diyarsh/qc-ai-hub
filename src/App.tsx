import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AIStudio from "./pages/AIStudio";
import History from "./pages/History";
import Projects from "./pages/Projects";
import ProjectChat from "./pages/ProjectChat";
import Lab from "./pages/Lab";
import Developer from "./pages/Developer";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/Layout";
import { LanguageProvider } from "./contexts/LanguageContext";
import { DeveloperModeProvider } from "./contexts/DeveloperModeContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <DeveloperModeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/project-chat" element={<ProjectChat />} />
              <Route
                path="/*"
                element={
                  <Layout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/ai-studio" element={<AIStudio />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/lab" element={<Lab />} />
                      <Route path="/developer" element={<Developer />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DeveloperModeProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
