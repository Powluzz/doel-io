import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, Plus, Check, Target, Sparkles } from "lucide-react";
import * as store from "@/lib/storage-client";
import { useToast } from "@/hooks/use-toast";

type Emotion = { label: string; intensity: number };
type HelpRating = "ja" | "een_beetje" | "nee";

interface WizardState {
  step: number;
  goalId: string;
  event: string;
  feelings: Emotion[];
  thoughts: string;
  behaviour: string;
  consequence: string;
  helpsGoal: HelpRating | "";
  helpfulThought: string;
  ifSituation: string;
  thenBehaviour: string;
}

const EMOTIONS = ["bang", "boos", "bedroefd", "gespannen", "beschaamd", "blij", "opgelucht"];
const EMOTION_EMOJIS: Record<string, string> = {
  bang: "\uD83D\uDE30", boos: "\uD83D\uDE20", bedroefd: "\uD83D\uDE22", gespannen: "\uD83D\uDE2C",
  beschaamd: "\uD83D\uDE33", blij: "\uD83D\uDE0A", opgelucht: "\uD83D\uDE0C",
};

const THOUGHT_SUGGESTIONS = [
  "Ik kan dit niet aan", "Ik faal als dit misgaat", "Ze zullen wel denken dat...",
  "Het gaat toch fout", "Ik ben niet goed genoeg",
];

const CATEGORIES = [
  { value: "werk", label: "Werk" }, { value: "relaties", label: "Relaties" },
  { value: "gezondheid", label: "Gezondheid" }, { value: "zelfbeeld", label: "Zelfbeeld" },
  { value: "overig", label: "Overig" },
];

const STEPS = ["Doel", "Gebeurtenis", "Gevoelens", "Gedachten", "Gedrag & Gevolg", "Reflectie", "Actie", "Klaar"];

export default function GSchemaWizard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState("overig");
  const [isSaving, setIsSaving] = useState(false);

  const { data: goals = [] } = useQuery({ queryKey: ["goals"], queryFn: () => store.getGoals() });

  const [state, setState] = useState<WizardState>({
    step: 0, goalId: "", event: "", feelings: [], thoughts: "",
    behaviour: "", consequence: "", helpsGoal: "", helpfulThought: "",
    ifSituation: "", thenBehaviour: "",
  });

  const activeGoals = goals.filter((g: any) => !g.archivedAt);
  const selectedGoal = activeGoals.find((g: any) => g.id === state.goalId);

  async function handleCreateGoal() {
    if (!newGoalTitle.trim()) return;
    try {
      const goal = await store.createGoal(newGoalTitle.trim(), newGoalCategory);
      // Voeg het nieuwe doel direct toe aan de cache zodat het meteen zichtbaar is
      queryClient.setQueryData(["goals"], (old: any[] = []) => [goal, ...old]);
      setState(s => ({ ...s, goalId: goal.id }));
      setShowNewGoal(false);
      setNewGoalTitle("");
      setNewGoalCategory("overig");
    } catch (err: any) {
      toast({ title: "Fout", description: err.message, variant: "destructive" });
    }
  }

  function toggleEmotion(label: string) {
    setState(s => {
      const exists = s.feelings.find(f => f.label === label);
      if (exists) return { ...s, feelings: s.feelings.filter(f => f.label !== label) };
      return { ...s, feelings: [...s.feelings, { label, intensity: 50 }] };
    });
  }

  function updateIntensity(label: string, intensity: number) {
    setState(s => ({ ...s, feelings: s.feelings.map(f => f.label === label ? { ...f, intensity } : f) }));
  }

  function canNext(): boolean {
    switch (state.step) {
      case 0: return !!state.goalId;
      case 1: return state.event.trim().length > 0;
      case 2: return state.feelings.length > 0;
      case 3: return state.thoughts.trim().length > 0;
      default: return true;
    }
  }

  async function next() {
    if (state.step === 6) {
      setIsSaving(true);
      try {
        const entry = await store.createEntry({
          goalId: state.goalId,
          event: state.event,
          thoughts: state.thoughts,
          feelings: state.feelings,
          behaviour: state.behaviour || undefined,
          consequence: state.consequence || undefined,
          helpfulThought: state.helpfulThought || undefined,
          helpsGoal: state.helpsGoal || undefined,
        });

        if (state.ifSituation && state.thenBehaviour) {
          await store.createAction({
            goalId: state.goalId,
            gEntryId: entry.id,
            ifSituation: state.ifSituation,
            thenBehaviour: state.thenBehaviour,
          });
        }
        queryClient.invalidateQueries({ queryKey: ["entries"] });
        queryClient.invalidateQueries({ queryKey: ["actions"] });
        setState(s => ({ ...s, step: 7 }));
      } catch (err: any) {
        toast({ title: "Fout", description: err.message, variant: "destructive" });
      } finally {
        setIsSaving(false);
      }
      return;
    }
    setState(s => ({ ...s, step: s.step + 1 }));
  }

  function back() {
    if (state.step === 0) { navigate("~/app"); return; }
    setState(s => ({ ...s, step: s.step - 1 }));
  }

  const progress = Math.round((state.step / 7) * 100);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={back} className="p-1 -ml-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">G-schema Wizard</span>
              <span className="text-[10px] font-bold text-primary">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 pb-24 overflow-y-auto">
        {state.step < 7 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Stap {state.step + 1} van 7</p>
            <h1 className="text-xl font-bold text-foreground">{STEPS[state.step]}</h1>
            {selectedGoal && (
              <Badge variant="secondary" className="mt-2 gap-1.5 font-medium">
                <Target size={12} /> {selectedGoal.title}
              </Badge>
            )}
          </div>
        )}

        {state.step === 0 && (
          <div className="space-y-4">
            <div className="mb-2">
              <h2 className="text-lg font-bold text-foreground">Welk doel wil je behalen?</h2>
              <p className="text-sm text-muted-foreground mt-1">Kies een doel waar je nu aan wilt werken. Je G-schema helpt je om daar stappen in te zetten.</p>
            </div>
            <div className="space-y-3">
              {activeGoals.map((goal: any) => (
                <button
                  key={goal.id}
                  onClick={() => setState(s => ({ ...s, goalId: goal.id }))}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    state.goalId === goal.id ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <p className="font-bold text-foreground">{goal.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">{goal.category}</p>
                  {state.goalId === goal.id && <Check className="absolute top-4 right-4 text-primary" size={20} />}
                </button>
              ))}
              <button onClick={() => setShowNewGoal(true)} data-testid="button-new-goal" className="w-full p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-muted/50 transition-all flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"><Plus size={20} /></div>
                <span className="font-medium">Nieuw doel aanmaken</span>
              </button>
            </div>
          </div>
        )}

        {state.step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Wat gebeurde er rondom dit doel?</h2>
              <p className="text-sm text-muted-foreground mt-1">Beschrijf kort een recente situatie die te maken heeft met "{selectedGoal?.title}".</p>
            </div>
            <Textarea
              data-testid="input-event"
              placeholder="Bijvoorbeeld: Mijn leidinggevende stuurde laat op de avond een mail..."
              value={state.event}
              onChange={e => setState(s => ({ ...s, event: e.target.value }))}
              rows={3}
              className="resize-none"
            />
          </div>
        )}

        {state.step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Hoe voelde je je in dat moment?</h2>
              <p className="text-sm text-muted-foreground mt-1">Selecteer de emoties die je voelde en stel de intensiteit in.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map(emotion => {
                const selected = state.feelings.find(f => f.label === emotion);
                return (
                  <button key={emotion} onClick={() => toggleEmotion(emotion)} data-testid={`emotion-chip-${emotion}`} className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border-2 transition-all ${ selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/40" }`}>
                    {EMOTION_EMOJIS[emotion]} {emotion}
                  </button>
                );
              })}
            </div>
            {state.feelings.map(feeling => (
              <div key={feeling.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{EMOTION_EMOJIS[feeling.label]} {feeling.label}</span>
                  <span className="text-sm font-bold text-primary">{feeling.intensity}%</span>
                </div>
                <Slider value={[feeling.intensity]} onValueChange={([v]) => updateIntensity(feeling.label, v)} min={0} max={100} step={5} />
              </div>
            ))}
          </div>
        )}

        {state.step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Welke gedachte ging er door je heen?</h2>
              <p className="text-sm text-muted-foreground mt-1">Kies de gedachte die je het meest bezighoudt.</p>
            </div>
            <Textarea data-testid="input-thoughts" placeholder="Schrijf je gedachte op..." value={state.thoughts} onChange={e => setState(s => ({ ...s, thoughts: e.target.value }))} rows={3} className="resize-none" />
            <div className="space-y-1.5">
              {THOUGHT_SUGGESTIONS.map(t => (
                <button key={t} onClick={() => setState(s => ({ ...s, thoughts: t }))} className="w-full text-left text-xs bg-muted hover:bg-muted/70 rounded-lg px-3 py-2 text-muted-foreground transition-colors">"{t}"</button>
              ))}
            </div>
          </div>
        )}

        {state.step === 4 && (
          <div className="space-y-5">
            <div><h2 className="text-lg font-bold text-foreground">Gedrag & Gevolg</h2></div>
            <div className="space-y-2">
              <Label>Wat deed je op dat moment?</Label>
              <Textarea data-testid="input-behaviour" placeholder="Bijv. Ik trok me terug..." value={state.behaviour} onChange={e => setState(s => ({ ...s, behaviour: e.target.value }))} rows={3} className="resize-none" />
            </div>
            <div className="space-y-2">
              <Label>Wat was het gevolg op korte termijn?</Label>
              <Textarea data-testid="input-consequence" placeholder="Bijv. Ik voelde me even beter..." value={state.consequence} onChange={e => setState(s => ({ ...s, consequence: e.target.value }))} rows={3} className="resize-none" />
            </div>
          </div>
        )}

        {state.step === 5 && (
          <div className="space-y-5">
            <div><h2 className="text-lg font-bold text-foreground">Reflectie</h2></div>
            <div className="space-y-2">
              <Label>Hoe helpt deze gedachte je?</Label>
              <div className="flex gap-2">
                {["ja", "een_beetje", "nee"].map((rating: any) => (
                  <button key={rating} onClick={() => setState(s => ({ ...s, helpsGoal: rating }))} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${ state.helpsGoal === rating ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground" }`}>
                    {rating === "ja" ? "Helpt \u2713" : rating === "een_beetje" ? "Een beetje" : "Helpt niet"}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Wat is een helpendere gedachte?</Label>
              <Textarea data-testid="input-helpful-thought" value={state.helpfulThought} onChange={e => setState(s => ({ ...s, helpfulThought: e.target.value }))} rows={3} className="resize-none" />
            </div>
          </div>
        )}

        {state.step === 6 && (
          <div className="space-y-5">
            <div><h2 className="text-lg font-bold text-foreground">Welke kleine actie wil je proberen?</h2></div>
            <div className="bg-muted/40 rounded-xl p-4 space-y-3">
              <div className="space-y-2">
                <Label>Als...</Label>
                <Input data-testid="input-if-situation" value={state.ifSituation} onChange={e => setState(s => ({ ...s, ifSituation: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>dan ga ik...</Label>
                <Input data-testid="input-then-behaviour" value={state.thenBehaviour} onChange={e => setState(s => ({ ...s, thenBehaviour: e.target.value }))} />
              </div>
            </div>
          </div>
        )}

        {state.step === 7 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary"><Sparkles size={36} /></div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Mooi, je hebt aan "{selectedGoal?.title}" gewerkt!</h2>
              <p className="text-muted-foreground text-sm">Elke situatie die je zo onderzoekt, is een oefening richting je doel.</p>
            </div>
            <Button className="w-full" onClick={() => navigate("~/app")}>Klaar</Button>
          </div>
        )}
      </div>

      {state.step < 7 && (
        <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border px-4 py-3">
          <Button onClick={next} disabled={!canNext() || isSaving} className="w-full gap-2">
            {isSaving ? "Opslaan..." : state.step === 6 ? <>Opslaan <Check size={16} /></> : <>Volgende <ArrowRight size={16} /></>}
          </Button>
        </div>
      )}

      <Dialog open={showNewGoal} onOpenChange={setShowNewGoal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nieuw doel aanmaken</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <Input placeholder="Bijv. Minder spanning ervaren" value={newGoalTitle} onChange={e => setNewGoalTitle(e.target.value)} />
            <Button className="w-full" disabled={!newGoalTitle.trim()} onClick={handleCreateGoal}>Doel aanmaken & starten</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
