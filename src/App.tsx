
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";
import MainNavBar from "@/components/MainNavBar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chatbot from "./pages/Chatbot";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MealPlans from "./pages/MealPlans";
import MealPlanDetails from "./pages/MealPlanDetails";
import Recipes from "./pages/Recipes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <MainNavBar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/chatbot" element={<PrivateRoute><Chatbot /></PrivateRoute>} />
                <Route path="/meal-plans" element={<PrivateRoute><MealPlans /></PrivateRoute>} />
                <Route path="/meal-plans/:id" element={<PrivateRoute><MealPlanDetails /></PrivateRoute>} />
                <Route path="/recipes" element={<PrivateRoute><Recipes /></PrivateRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
