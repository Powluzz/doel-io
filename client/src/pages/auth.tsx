import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { setAuth } from "@/lib/auth";

const gSchema = [
  { label: "Gebeurtenis", color: "bg-blue-50 border-blue-100 text-blue-800" },
  { label: "Gedachten", color: "bg-purple-50 border-purple-100 text-purple-800" },
  { label: "Gevoelens", color: "bg-rose-50 border-rose-100 text-rose-800" },
  { label: "Gedrag", color: "bg-amber-50 border-amber-100 text-amber-800" },
  { label: "Gevolgen", color: "bg-green-50 border-green-100 text-green-800" },
];

interface AuthPageProps {
  onAuth: () => void;
  initialMode?: "login" | "register";
}

type Step = "credentials" | "verify";

export default function AuthPage({ onAuth, initialMode = "login" }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [step, setStep] = useState<Step>("credentials");
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { toast } = useToast();

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body: any = { email, password };
      if (mode === "register") body.name = name;
      const data = await apiRequest("POST", endpoint, body);
      setUserId(data.userId);
      setUserEmail(email);
      setStep("verify");
    } catch (err: any) {
      toast({ title: "Fout", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiRequest("POST", "/api/auth/verify", { userId, code });
      setAuth(data.token, data.user);
      onAuth();
    } catch (err: any) {
      toast({ title: "Onjuiste code", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    try {
      await apiRequest("POST", "/api/auth/resend-code", { userId });
      toast({ title: "Code opnieuw verstuurd", description: `Controleer je inbox op ${userEmail}.` });
    } catch (err: any) {
      toast({ title: "Fout", description: err.message, variant: "destructive" });
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="text-foreground">
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">

            {step === "credentials" && (
              <>
                <p className="text-lg text-muted-foreground">
                  {mode === "login" ? "Log in en ga verder aan je doelen." : "Maak een account aan en start met je eerste G-schema."}
                </p>
                <form onSubmit={handleCredentials} className="space-y-4 max-w-sm">
                  {mode === "register" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Naam</Label>
                      <Input id="name" placeholder="Jouw naam" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label htmlFor="email">E-mailadres</Label>
                    <Input id="email" type="email" placeholder="jij@voorbeeld.nl" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Wachtwoord</Label>
                    <Input id="password" type="password" placeholder={mode === "register" ? "Minimaal 6 tekens" : "Je wachtwoord"} value={password} onChange={e => setPassword(e.target.value)} required minLength={mode === "register" ? 6 : 1} />
                  </div>
                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? "Even geduld..." : mode === "login" ? "Inloggen" : "Account aanmaken"}
                  </Button>
                </form>
                <button type="button" className="text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMode(mode === "login" ? "register" : "login")}>
                  {mode === "login" ? "Nog geen account? Aanmelden" : "Al een account? Inloggen"}
                </button>
              </>
            )}

            {step === "verify" && (
              <>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Controleer je e-mail</h2>
                  <p className="text-muted-foreground text-sm">
                    We hebben een 6-cijferige code gestuurd naar <strong>{userEmail}</strong>.<br />
                    De code is 10 minuten geldig.
                  </p>
                </div>
                <form onSubmit={handleVerify} className="space-y-4 max-w-sm">
                  <div className="space-y-1.5">
                    <Label htmlFor="code">Verificatiecode</Label>
                    <Input
                      id="code"
                      placeholder="123456"
                      value={code}
                      onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      required
                      className="text-2xl tracking-widest text-center"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full" disabled={loading || code.length < 6}>
                    {loading ? "Controleren..." : "Bevestigen"}
                  </Button>
                </form>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Code niet ontvangen?</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-primary hover:underline disabled:opacity-50"
                  >
                    {resending ? "Versturen..." : "Opnieuw versturen"}
                  </button>
                </div>
                <button type="button" className="text-sm text-muted-foreground hover:text-foreground" onClick={() => { setStep("credentials"); setCode(""); }}>
                  ← Terug
                </button>
              </>
            )}

            <p className="text-xs text-muted-foreground border-t border-border pt-4">
              Gebaseerd op cognitieve gedragstherapie en het bewezen G-schema-model.
            </p>
          </div>

          <div className="flex-shrink-0 w-full md:w-72">
            <div className="bg-card border border-border rounded-2xl p-5 space-y-2 shadow-sm">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Voorbeeld G-schema</p>
              {gSchema.map((item, i) => (
                <div key={item.label} className={`rounded-xl border px-4 py-3 ${item.color} text-sm font-medium flex items-center gap-3`}>
                  <span className="w-5 h-5 rounded-full bg-white/60 flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
