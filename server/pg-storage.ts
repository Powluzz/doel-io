import { eq, and, gte, lte, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users, goals, gEntries, actions, notificationPreferences,
  type User, type InsertUser,
  type Goal, type InsertGoal,
  type GEntry, type InsertGEntry,
  type Action, type InsertAction,
  type NotificationPref, type InsertNotificationPref,
} from "@shared/schema";
import type { IStorage } from "./storage";

export class PgStorage implements IStorage {
  // --- Users ---
  async createUser(data: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // --- Goals ---
  async getGoals(userId: string): Promise<Goal[]> {
    return db.select().from(goals)
      .where(and(eq(goals.userId, userId), eq(goals.archivedAt, null as any)))
      .orderBy(desc(goals.createdAt));
  }

  async getGoalById(id: string, userId: string): Promise<Goal | undefined> {
    const [goal] = await db.select().from(goals)
      .where(and(eq(goals.id, id), eq(goals.userId, userId)));
    return goal;
  }

  async createGoal(data: InsertGoal): Promise<Goal> {
    const [goal] = await db.insert(goals).values(data).returning();
    return goal;
  }

  async updateGoal(id: string, userId: string, data: Partial<InsertGoal & { archivedAt: Date | null }>): Promise<Goal | undefined> {
    const [goal] = await db.update(goals)
      .set(data)
      .where(and(eq(goals.id, id), eq(goals.userId, userId)))
      .returning();
    return goal;
  }

  async deleteGoal(id: string, userId: string): Promise<void> {
    await db.delete(goals).where(and(eq(goals.id, id), eq(goals.userId, userId)));
  }

  // --- GEntries ---
  async getGEntries(userId: string, params?: { goalId?: string; from?: Date; to?: Date }): Promise<GEntry[]> {
    const conditions = [eq(gEntries.userId, userId)];
    if (params?.goalId) conditions.push(eq(gEntries.goalId, params.goalId));
    if (params?.from) conditions.push(gte(gEntries.timestamp, params.from));
    if (params?.to) conditions.push(lte(gEntries.timestamp, params.to));

    return db.select().from(gEntries)
      .where(and(...conditions))
      .orderBy(desc(gEntries.timestamp));
  }

  async getGEntryById(id: string, userId: string): Promise<GEntry | undefined> {
    const [entry] = await db.select().from(gEntries)
      .where(and(eq(gEntries.id, id), eq(gEntries.userId, userId)));
    return entry;
  }

  async createGEntry(data: InsertGEntry): Promise<GEntry> {
    const [entry] = await db.insert(gEntries).values(data).returning();
    return entry;
  }

  async updateGEntry(id: string, userId: string, data: Partial<InsertGEntry>): Promise<GEntry | undefined> {
    const [entry] = await db.update(gEntries)
      .set(data)
      .where(and(eq(gEntries.id, id), eq(gEntries.userId, userId)))
      .returning();
    return entry;
  }

  // --- Actions ---
  async getActions(userId: string, params?: { goalId?: string; status?: string }): Promise<Action[]> {
    const conditions = [eq(actions.userId, userId)];
    if (params?.goalId) conditions.push(eq(actions.goalId, params.goalId));
    if (params?.status) conditions.push(eq(actions.status, params.status));

    return db.select().from(actions)
      .where(and(...conditions))
      .orderBy(desc(actions.createdAt));
  }

  async getTodayActions(userId: string): Promise<Action[]> {
    const acts = await db.select().from(actions)
      .where(and(eq(actions.userId, userId), eq(actions.status, "planned")))
      .orderBy(desc(actions.createdAt))
      .limit(5);
    return acts;
  }

  async createAction(data: InsertAction): Promise<Action> {
    const [action] = await db.insert(actions).values(data).returning();
    return action;
  }

  async updateAction(id: string, userId: string, data: Partial<InsertAction>): Promise<Action | undefined> {
    const [action] = await db.update(actions)
      .set(data)
      .where(and(eq(actions.id, id), eq(actions.userId, userId)))
      .returning();
    return action;
  }

  // --- Insights ---
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

  // --- Notification Preferences ---
  async getNotificationPrefs(userId: string): Promise<NotificationPref[]> {
    return db.select().from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId));
  }

  async createNotificationPref(data: InsertNotificationPref): Promise<NotificationPref> {
    const [pref] = await db.insert(notificationPreferences).values(data).returning();
    return pref;
  }

  async updateNotificationPref(id: string, userId: string, data: Partial<InsertNotificationPref>): Promise<NotificationPref | undefined> {
    const [pref] = await db.update(notificationPreferences)
      .set(data)
      .where(and(eq(notificationPreferences.id, id), eq(notificationPreferences.userId, userId)))
      .returning();
    return pref;
  }
}
