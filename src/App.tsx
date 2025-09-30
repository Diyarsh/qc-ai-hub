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
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/ai-studio" element={<Layout><AIStudio /></Layout>} />
              <Route path="/history" element={<Layout><History /></Layout>} />
              <Route path="/projects" element={<Layout><Projects /></Layout>} />
              <Route path="/lab" element={<Layout><Lab /></Layout>} />
              <Route path="/developer" element={<Layout><Developer /></Layout>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DeveloperModeProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
