import {
  users, goals, gEntries, actions, notificationPreferences,
  type User, type InsertUser,
  type Goal, type InsertGoal,
  type GEntry, type InsertGEntry,
  type Action, type InsertAction,
  type NotificationPref, type InsertNotificationPref,
} from "@shared/schema";

export interface IStorage {
  // Users
  createUser(data: InsertUser): Promise<User>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;

  // Goals
  getGoals(userId: string): Promise<Goal[]>;
  getGoalById(id: string, userId: string): Promise<Goal | undefined>;
  createGoal(data: InsertGoal): Promise<Goal>;
  updateGoal(id: string, userId: string, data: Partial<InsertGoal & { archivedAt: Date | null }>): Promise<Goal | undefined>;
  deleteGoal(id: string, userId: string): Promise<void>;

  // GEntries
  getGEntries(userId: string, params?: { goalId?: string; from?: Date; to?: Date }): Promise<GEntry[]>;
  getGEntryById(id: string, userId: string): Promise<GEntry | undefined>;
  createGEntry(data: InsertGEntry): Promise<GEntry>;
  updateGEntry(id: string, userId: string, data: Partial<InsertGEntry>): Promise<GEntry | undefined>;

  // Actions
  getActions(userId: string, params?: { goalId?: string; status?: string }): Promise<Action[]>;
  getTodayActions(userId: string): Promise<Action[]>;
  createAction(data: InsertAction): Promise<Action>;
  updateAction(id: string, userId: string, data: Partial<InsertAction>): Promise<Action | undefined>;

  // Insights
  getEmotionInsights(userId: string, days: number): Promise<Array<{ date: string; emotions: Record<string, number> }>>;
  getGoalsSummary(userId: string): Promise<Array<{ goalId: string; goalTitle: string; entryCount: number; actionsDone: number }>>;

  // Notification Preferences
  getNotificationPrefs(userId: string): Promise<NotificationPref[]>;
  createNotificationPref(data: InsertNotificationPref): Promise<NotificationPref>;
  updateNotificationPref(id: string, userId: string, data: Partial<InsertNotificationPref>): Promise<NotificationPref | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private goals: Map<string, Goal> = new Map();
  private gEntries: Map<string, GEntry> = new Map();
  private actions: Map<string, Action> = new Map();
  private notifPrefs: Map<string, NotificationPref> = new Map();

  private genId(): string {
    return crypto.randomUUID();
  }

  // Users
  async createUser(data: InsertUser): Promise<User> {
    const user: User = { ...data, id: this.genId(), createdAt: new Date() };
    this.users.set(user.id, user);
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  // Goals
  async getGoals(userId: string): Promise<Goal[]> {
    return Array.from(this.goals.values())
      .filter(g => g.userId === userId && !g.archivedAt)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getGoalById(id: string, userId: string): Promise<Goal | undefined> {
    const g = this.goals.get(id);
    return g?.userId === userId ? g : undefined;
  }

  async createGoal(data: InsertGoal): Promise<Goal> {
    const goal: Goal = { ...data, id: this.genId(), createdAt: new Date(), archivedAt: null, description: data.description ?? null };
    this.goals.set(goal.id, goal);
    return goal;
  }

  async updateGoal(id: string, userId: string, data: Partial<InsertGoal & { archivedAt: Date | null }>): Promise<Goal | undefined> {
    const goal = this.goals.get(id);
    if (!goal || goal.userId !== userId) return undefined;
    const updated = { ...goal, ...data };
    this.goals.set(id, updated);
    return updated;
  }

  async deleteGoal(id: string, userId: string): Promise<void> {
    const goal = this.goals.get(id);
    if (goal?.userId === userId) this.goals.delete(id);
  }

  // GEntries
  async getGEntries(userId: string, params?: { goalId?: string; from?: Date; to?: Date }): Promise<GEntry[]> {
    return Array.from(this.gEntries.values())
      .filter(e => {
        if (e.userId !== userId) return false;
        if (params?.goalId && e.goalId !== params.goalId) return false;
        if (params?.from && e.timestamp < params.from) return false;
        if (params?.to && e.timestamp > params.to) return false;
        return true;
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getGEntryById(id: string, userId: string): Promise<GEntry | undefined> {
    const e = this.gEntries.get(id);
    return e?.userId === userId ? e : undefined;
  }

  async createGEntry(data: InsertGEntry): Promise<GEntry> {
    const entry: GEntry = {
      ...data,
      id: this.genId(),
      createdAt: new Date(),
      behaviour: data.behaviour ?? null,
      consequence: data.consequence ?? null,
      helpfulThought: data.helpfulThought ?? null,
      helpsGoal: data.helpsGoal ?? null,
      contextTags: data.contextTags ?? [],
    };
    this.gEntries.set(entry.id, entry);
    return entry;
  }

  async updateGEntry(id: string, userId: string, data: Partial<InsertGEntry>): Promise<GEntry | undefined> {
    const entry = this.gEntries.get(id);
    if (!entry || entry.userId !== userId) return undefined;
    const updated = { ...entry, ...data };
    this.gEntries.set(id, updated);
    return updated;
  }

  // Actions
  async getActions(userId: string, params?: { goalId?: string; status?: string }): Promise<Action[]> {
    return Array.from(this.actions.values())
      .filter(a => {
        if (a.userId !== userId) return false;
        if (params?.goalId && a.goalId !== params.goalId) return false;
        if (params?.status && a.status !== params.status) return false;
        return true;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTodayActions(userId: string): Promise<Action[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return Array.from(this.actions.values())
      .filter(a => a.userId === userId && a.status === "planned")
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
  }

  async createAction(data: InsertAction): Promise<Action> {
    const action: Action = {
      ...data,
      id: this.genId(),
      createdAt: new Date(),
      gEntryId: data.gEntryId ?? null,
      dueAt: data.dueAt ?? null,
    };
    this.actions.set(action.id, action);
    return action;
  }

  async updateAction(id: string, userId: string, data: Partial<InsertAction>): Promise<Action | undefined> {
    const action = this.actions.get(id);
    if (!action || action.userId !== userId) return undefined;
    const updated = { ...action, ...data };
    this.actions.set(id, updated);
    return updated;
  }

  // Insights
  async getEmotionInsights(userId: string, days: number): Promise<Array<{ date: string; emotions: Record<string, number> }>> {
    const from = new Date();
    from.setDate(from.getDate() - days);

    const entries = await this.getGEntries(userId, { from });
    const byDate: Record<string, Record<string, number[]>> = {};

    for (const entry of entries) {
      const date = entry.timestamp.toISOString().split("T")[0];
      if (!byDate[date]) byDate[date] = {};
      for (const feeling of (entry.feelings as Array<{ label: string; intensity: number }>)) {
        if (!byDate[date][feeling.label]) byDate[date][feeling.label] = [];
        byDate[date][feeling.label].push(feeling.intensity);
      }
    }

    return Object.entries(byDate).map(([date, emotions]) => ({
      date,
      emotions: Object.fromEntries(
        Object.entries(emotions).map(([label, vals]) => [
          label,
          Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
        ])
      ),
    })).sort((a, b) => a.date.localeCompare(b.date));
  }

  async getGoalsSummary(userId: string): Promise<Array<{ goalId: string; goalTitle: string; entryCount: number; actionsDone: number }>> {
    const userGoals = await this.getGoals(userId);
    const result = [];

    for (const goal of userGoals) {
      const entries = await this.getGEntries(userId, { goalId: goal.id });
      const acts = await this.getActions(userId, { goalId: goal.id, status: "done" });
      result.push({
        goalId: goal.id,
        goalTitle: goal.title,
        entryCount: entries.length,
        actionsDone: acts.length,
      });
    }

    return result;
  }

  // Notification Preferences
  async getNotificationPrefs(userId: string): Promise<NotificationPref[]> {
    return Array.from(this.notifPrefs.values()).filter(p => p.userId === userId);
  }

  async createNotificationPref(data: InsertNotificationPref): Promise<NotificationPref> {
    const pref: NotificationPref = { ...data, id: this.genId(), createdAt: new Date() };
    this.notifPrefs.set(pref.id, pref);
    return pref;
  }

  async updateNotificationPref(id: string, userId: string, data: Partial<InsertNotificationPref>): Promise<NotificationPref | undefined> {
    const pref = this.notifPrefs.get(id);
    if (!pref || pref.userId !== userId) return undefined;
    const updated = { ...pref, ...data };
    this.notifPrefs.set(id, updated);
    return updated;
  }
}

import { PgStorage } from "./pg-storage";
export const storage: IStorage = process.env.DATABASE_URL ? new PgStorage() : new MemStorage();
