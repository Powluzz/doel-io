import { Component, type ReactNode, useState, useEffect } from "react";
import { Switch, Route, useLocation, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { isAuthenticated } from "./lib/auth";
import AuthPage from "./pages/auth";
import LandingPage from "./pages/landing";
import OverPage from "./pages/over";
import HomePage from "./pages/home";
import GSchemaWizard from "./pages/g-schema-wizard";
import InsightPage from "./pages/insight";
import ProfilePage from "./pages/profile";
import NotFound from "./pages/not-found";
import BottomNav from "./components/BottomNav";
import LogoMenu from "./components/LogoMenu";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: string | null }
> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) {
    return { error: e.message };
  }
  render() {
    if (this.state.error)
      return (
        <div style={{ padding: 24, color: "red", fontFamily: "monospace" }}>
          <b>Fout:</b> {this.state.error}
        </div>
      );
    return this.props.children;
  }
}

function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto relative">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="px-4 py-3 flex items-center">
          <LogoMenu />
        </div>
      </header>
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}

function RedirectToLogin() {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate("~/login");
  }, []);
  return null;
}

function AppRoutes() {
  const [authed, setAuthed] = useState(isAuthenticated);
  const [, navigate] = useLocation();

  useEffect(() => {
    const sync = () => setAuthed(isAuthenticated());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  function handleAuth() {
    setAuthed(true);
    navigate("~/app");
  }

  function guardedRoute(page: ReactNode) {
    if (!authed) return <RedirectToLogin />;
    return page;
  }

  return (
    <Switch>
      {/* Publieke routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/over" component={OverPage} />
      <Route path="/login">
        <AuthPage onAuth={handleAuth} />
      </Route>
      <Route path="/signup">
        <AuthPage onAuth={handleAuth} initialMode="register" />
      </Route>

      {/* Beveiligde routes */}
      <Route path="/app">
        {guardedRoute(<AppShell><HomePage /></AppShell>)}
      </Route>
      <Route path="/g-schema">
        {guardedRoute(<AppShell><GSchemaWizard /></AppShell>)}
      </Route>
      <Route path="/inzicht">
        {guardedRoute(<AppShell><InsightPage /></AppShell>)}
      </Route>
      <Route path="/profiel">
        {guardedRoute(<AppShell><ProfilePage /></AppShell>)}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router hook={useHashLocation}>
          <AppRoutes />
          <Toaster />
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
