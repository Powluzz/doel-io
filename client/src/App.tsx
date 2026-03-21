import { Switch, Route, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import { isAuthenticated } from "./lib/auth";
import { Router } from "wouter";
import AuthPage from "./pages/auth";
import LandingPage from "./pages/landing";
import HomePage from "./pages/home";
import GSchemaWizard from "./pages/g-schema-wizard";
import InsightPage from "./pages/insight";
import ProfilePage from "./pages/profile";
import NotFound from "./pages/not-found";
import BottomNav from "./components/BottomNav";
import Logo from "./components/Logo";

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto relative">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="px-4 py-3 flex items-center">
          <Logo variant="kleur" size="full" height={26} />
        </div>
      </header>
      <main className="flex-1 pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

/** Guard-component: redirect naar /login als niet ingelogd, anders toon children */
function Protected({ children }: { children: React.ReactNode }) {
  const [, navigate] = useLocation();
  const authed = isAuthenticated();
  useEffect(() => {
    if (!authed) navigate("/login");
  }, [authed, navigate]);
  if (!authed) return null;
  return <>{children}</>;
}

function AppRoutes() {
  const [authed, setAuthed] = useState(isAuthenticated);
  const [, navigate] = useLocation();

  useEffect(() => {
    function syncAuth() { setAuthed(isAuthenticated()); }
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  function handleAuth() {
    setAuthed(true);
    navigate("/app");
  }

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login">
        {authed ? null : <AuthPage onAuth={handleAuth} />}
      </Route>
      <Route path="/signup">
        {authed ? null : <AuthPage onAuth={handleAuth} initialMode="register" />}
      </Route>
      <Route path="/app">
        <Protected><AppShell><HomePage /></AppShell></Protected>
      </Route>
      <Route path="/g-schema">
        <Protected><AppShell><GSchemaWizard /></AppShell></Protected>
      </Route>
      <Route path="/inzicht">
        <Protected><AppShell><InsightPage /></AppShell></Protected>
      </Route>
      <Route path="/profiel">
        <Protected><AppShell><ProfilePage /></AppShell></Protected>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <Router hook={useHashLocation}>
      <AppRoutes />
      <Toaster />
    </Router>
  );
}
