import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PortfolioProvider } from "./contexts/PortfolioContext";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/admin/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import UserLoginPage from "./pages/UserLoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import NotFound from "./pages/NotFound";
import { useAuth } from "./_core/hooks/useAuth";
import { useEffect } from "react";
import { safePostLoginDestination } from "@shared/accessControl";

function PostLoginRedirect() {
  const { user, loading } = useAuth();
  useEffect(() => {
    if (loading || !user) return;
    const requestedTarget = sessionStorage.getItem("portfolio-post-login-redirect");
    if (!requestedTarget) return;
    const target = safePostLoginDestination(user.role, requestedTarget);
    if (window.location.pathname !== target) {
      sessionStorage.removeItem("portfolio-post-login-redirect");
      window.location.assign(target);
    }
  }, [user, loading]);
  return null;
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={HomePage} />
      <Route path="/entrar" component={UserLoginPage} />
      <Route path="/cadastro" component={RegisterPage} />
      <Route path="/conta" component={AccountPage} />
      <Route path="/admin-login" component={AdminLoginPage} />
      <Route path="/projetos" component={ProjectsPage} />
      <Route path="/projetos/:slug" component={ProjectDetailPage} />
      <Route path="/sobre" component={AboutPage} />
      <Route path="/contato" component={ContactPage} />
      {/* Admin routes — protected inside AdminPage */}
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/:rest*" component={AdminPage} />
      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <PortfolioProvider>
            <Toaster />
            <PostLoginRedirect />
            <Router />
          </PortfolioProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
