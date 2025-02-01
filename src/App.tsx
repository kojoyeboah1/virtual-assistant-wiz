import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "@/pages/Index";
import Notes from "@/pages/Notes";
import Auth from "@/pages/Auth";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Help />} />
            </Routes>
          </Router>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;