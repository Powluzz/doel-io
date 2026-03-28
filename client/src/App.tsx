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
import PrivacyPage from "./pages/privacy";
import VoorwaardenPage from "./pages/voorwaarden";
import HomePage from "./pages/home";
import GSchemaWizard from "./pages/g-schema-wizard";
import InsightPage from "./pages/insight";
import ProfilePage from "./pages/profile";
import NotFound from "./pages/not-found";
import BottomNav from "./components/BottomNav";
import AppHeader from "./components/AppHeader";

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

function Layout({ children, bottomNav = false }: { children: ReactNode; bottomNav?: boolean }) {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-5xl mx-auto relative">
      <AppHeader />
      <main className={bottomNav ? "flex-1 pb-20" : "flex-1"}>{children}</main>
      {bottomNav && <BottomNav />}
    </div>
  );
}

function RedirectToLogin() {
  const [, navigate] = useLocation();
  useEffect(() => { navigate("~/login"); }, []);
  return null;
}

function AppRoutes() {
  const [authed, setAuthed] = useState(isAuthenticated);
  const [pendingNav, setPendingNav] = useState<string | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const sync = () => setAuthed(isAuthenticated());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // Navigate only after authed state is committed
  useEffect(() => {
    if (pendingNav && authed) {
      navigate(pendingNav);
      setPendingNav(null);
    }
  }, [authed, pendingNav]);

  function handleAuth() {
    setAuthed(true);
    setPendingNav("~/app");
  }

  function guarded(page: ReactNode) {
    if (!authed) return <RedirectToLogin />;
    return page;
  }

  return (
    <Switch>
      <Route path="/">
        <Layout><LandingPage /></Layout>
      </Route>
      <Route path="/over">
        <Layout><OverPage /></Layout>
      </Route>
      <Route path="/privacy">
        <Layout><PrivacyPage /></Layout>
      </Route>
      <Route path="/voorwaarden">
        <Layout><VoorwaardenPage /></Layout>
      </Route>
      <Route path="/login">
        <Layout>
          <AuthPage key="login" onAuth={handleAuth} initialMode="login" />
        </Layout>
      </Route>
      <Route path="/signup">
        <Layout>
          <AuthPage key="signup" onAuth={handleAuth} initialMode="register" />
        </Layout>
      </Route>
      <Route path="/app">
        {guarded(<Layout bottomNav><HomePage /></Layout>)}
      </Route>
      <Route path="/g-schema">
        {guarded(<Layout bottomNav><GSchemaWizard /></Layout>)}
      </Route>
      <Route path="/inzicht">
        {guarded(<Layout bottomNav><InsightPage /></Layout>)}
      </Route>
      <Route path="/profiel">
        {guarded(<Layout bottomNav><ProfilePage /></Layout>)}
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
