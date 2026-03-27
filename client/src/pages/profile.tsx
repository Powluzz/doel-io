import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Archive, Bell, LogOut, Plus, Target, User } from "lucide-react";
import * as store from "@/lib/storage-client";
import { clearAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const CATEGORIES = [
  { value: "werk", label: "Werk" },
  { value: "relaties", label: "Relaties" },
  { value: "gezondheid", label: "Gezondheid" },
  { value: "zelfbeeld", label: "Zelfbeeld" },
  { value: "overig", label: "Overig" },
];

export default function ProfilePage() {
  const user = store.getMe();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState("overig");

  const { data: allGoals = [] } = useQuery({ queryKey: ["goals", "all"], queryFn: () => store.getAllGoals() });
  const { data: notifPrefs = [] } = useQuery({ queryKey: ["notifPrefs"], queryFn: () => store.getNotifPrefs() });

  const activeGoals = allGoals.filter((g: any) => !g.archivedAt);
  const archivedGoals = allGoals.filter((g: any) => g.archivedAt);
  const dailyCheckin = notifPrefs.find((p: any) => p.type === "daily_checkin");
  const actionReminder = notifPrefs.find((p: any) => p.type === "action_reminder");

  function invalidateGoals() {
    queryClient.invalidateQueries({ queryKey: ["goals"] });
    queryClient.invalidateQueries({ queryKey: ["goals", "all"] });
  }

  async function handleCreateGoal() {
    if (!newGoalTitle.trim()) return;
    try {
      await store.createGoal(newGoalTitle.trim(), newGoalCategory);
      invalidateGoals();
      setShowNewGoal(false);
      setNewGoalTitle("");
      toast({ title: "Doel aangemaakt!" });
    } catch (err: any) {
      toast({ title: "Fout", description: err.message, variant: "destructive" });
    }
  }

  async function handleArchiveGoal(id: string, archive: boolean) {
    await store.archiveGoal(id, archive);
    invalidateGoals();
  }

  async function handleNotifToggle(type: string, active: boolean) {
    const existing = notifPrefs.find((p: any) => p.type === type);
    if (existing) {
      await store.updateNotifPref(existing.id, active);
    } else {
      await store.createNotifPref(type, active);
    }
    queryClient.invalidateQueries({ queryKey: ["notifPrefs"] });
  }

  function handleLogout() {
    clearAuth();
    queryClient.clear();
    navigate("~/login");
  }

  return (
    <div className="p-4 space-y-6">
      <div className="pt-4">
        <h1 className="text-xl font-bold text-foreground">Profiel</h1>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
          {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
        </div>
        <div>
          <p className="font-semibold text-foreground">{user?.name}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">Mijn doelen</h2>
          <Button size="sm" variant="outline" onClick={() => setShowNewGoal(true)} data-testid="button-add-goal" className="gap-1 h-8">
            <Plus size={14} /> Nieuw doel
          </Button>
        </div>

        {activeGoals.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Nog geen actieve doelen.</p>
        ) : (
          <div className="space-y-2">
            {activeGoals.map((goal: any) => (
              <div key={goal.id} className="bg-card border border-border rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-foreground">{goal.title}</p>
                  <Badge variant="outline" className="text-xs mt-1">{goal.category}</Badge>
                </div>
                <button
                  onClick={() => handleArchiveGoal(goal.id, true)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
                  title="Archiveren"
                  data-testid={`button-archive-${goal.id}`}
                >
                  <Archive size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {archivedGoals.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">{archivedGoals.length} gearchiveerd doel{archivedGoals.length !== 1 ? "en" : ""}</p>
            <div className="space-y-2">
              {archivedGoals.map((goal: any) => (
                <div key={goal.id} className="bg-muted/40 border border-border rounded-xl p-3 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{goal.title}</p>
                  <button onClick={() => handleArchiveGoal(goal.id, false)} className="text-xs text-primary hover:underline" data-testid={`button-unarchive-${goal.id}`}>
                    Herstellen
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Bell size={18} className="text-muted-foreground" />
          <h2 className="font-semibold text-foreground">Herinneringen</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Dagelijkse check-in</p>
              <p className="text-xs text-muted-foreground">Herinnering om een G-schema in te vullen</p>
            </div>
            <Switch checked={!!dailyCheckin?.active} onCheckedChange={(active) => handleNotifToggle("daily_checkin", active)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Actie-herinnering</p>
              <p className="text-xs text-muted-foreground">Reminder bij geplande Als-Dan acties</p>
            </div>
            <Switch checked={!!actionReminder?.active} onCheckedChange={(active) => handleNotifToggle("action_reminder", active)} />
          </div>
        </div>
      </div>

      <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-destructive hover:underline">
        <LogOut size={16} /> Uitloggen
      </button>

      <p className="text-xs text-muted-foreground text-center">
        <a href="https://www.perplexity.ai/computer" target="_blank" rel="noopener noreferrer" className="hover:underline">
          Gebouwd met Perplexity Computer
        </a>
      </p>

      <Dialog open={showNewGoal} onOpenChange={setShowNewGoal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nieuw doel aanmaken</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Omschrijf je doel in 1 zin</Label>
              <Input
                data-testid="input-profile-goal-title"
                placeholder="Bijv. Minder spanning ervaren op zondagavond"
                value={newGoalTitle}
                onChange={e => setNewGoalTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label>Categorie</Label>
              <Select value={newGoalCategory} onValueChange={setNewGoalCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (<SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" disabled={!newGoalTitle.trim()} onClick={handleCreateGoal}>
              Doel aanmaken
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
