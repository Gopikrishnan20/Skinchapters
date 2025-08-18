import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ScanPage from "./pages/ScanPage";
import SkinAnalysisPage from "./pages/SkinAnalysisPage";
import ResultsDashboardPage from "./pages/ResultsDashboardPage";
import ChaptersPage from "./pages/ChaptersPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignInPage";
import SignUp from "./pages/SignUpPage";
import ProtectedRoute from "./services/ProtectedRoute";

const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/scan"
            element={
              <ProtectedRoute>
                {" "}
                <ScanPage />{" "}
              </ProtectedRoute>
            }
          />
          <Route path="/analysis" element={ <ProtectedRoute> <SkinAnalysisPage /> </ProtectedRoute>} />
          <Route path="/results" element={ <ProtectedRoute> <ResultsDashboardPage /> </ProtectedRoute>} />
          <Route path="/chapters" element={<ChaptersPage />} />
          <Route path="/dashboard" element={ <ProtectedRoute> <DashboardPage /> </ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute> <ProfilePage /> </ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;