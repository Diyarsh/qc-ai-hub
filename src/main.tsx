import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainRoutes from "./routes";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./main/webapp/app/shared/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DeveloperModeProvider } from "@/contexts/DeveloperModeContext";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false, // Disable automatic retries for demo mode
			refetchOnWindowFocus: false, // Don't refetch on window focus for demo
			refetchOnReconnect: false, // Don't refetch on reconnect for demo
		},
		mutations: {
			retry: false, // Disable automatic retries for demo mode
		},
	},
});

import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "@/shared/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <DeveloperModeProvider>
              <TooltipProvider>
                <ToastProvider>
                  <Toaster />
                  <BrowserRouter>
                    <MainRoutes />
                  </BrowserRouter>
                </ToastProvider>
              </TooltipProvider>
            </DeveloperModeProvider>
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
