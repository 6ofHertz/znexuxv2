import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { SettingsProvider } from "./contexts/SettingsContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminAudit from "./pages/AdminAudit";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import HoverReceiver from "@/visual-edits/VisualEditsMessenger";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <AuthProvider>
            <SettingsProvider>
              <Toaster />
              <HoverReceiver />
              <Router>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/admin/audit" element={<AdminAudit />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
            </SettingsProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;