import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import * as crypto from "crypto";

// Simple session store in memory (no cookies/localStorage)
const sessions: Map<string, string> = new Map(); // token -> userId

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "doel-io-salt").digest("hex");
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function getUser(req: any): string | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  return sessions.get(token) ?? null;
}

function requireAuth(req: any, res: any): string | null {
  const userId = getUser(req);
  if (!userId) {
    res.status(401).json({ error: "Niet ingelogd" });
    return null;
  }
  return userId;
}

export async function registerRoutes(httpServer: Server, app: Express) {
  // --- AUTH ---
  app.post("/api/auth/register", async (req, res) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(1),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

    const existing = await storage.getUserByEmail(parsed.data.email);
    if (existing) return res.status(400).json({ error: "E-mailadres al in gebruik" });

    const user = await storage.createUser({
      email: parsed.data.email,
      passwordHash: hashPassword(parsed.data.password),
      name: parsed.data.name,
    });

    const token = generateToken();
    sessions.set(token, user.id);

    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  });

  app.post("/api/auth/login", async (req, res) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Ongeldige invoer" });

    const user = await storage.getUserByEmail(parsed.data.email);
    if (!user || user.passwordHash !== hashPassword(parsed.data.password)) {
      return res.status(401).json({ error: "Onjuist e-mailadres of wachtwoord" });
    }

    const token = generateToken();
    sessions.set(token, user.id);

    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  });

  app.post("/api/auth/logout", (req, res) => {
    const auth = req.headers.authorization;
    if (auth?.startsWith("Bearer ")) {
      sessions.delete(auth.slice(7));
    }
    res.json({ ok: true });
  });

  app.get("/api/auth/me", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const user = await storage.getUserById(userId);
    if (!user) return res.status(404).json({ error: "Gebruiker niet gevonden" });
    res.json({ id: user.id, email: user.email, name: user.name });
  });

  // --- GOALS ---
  app.get("/api/goals", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const goals = await storage.getGoals(userId);
    res.json(goals);
  });

  app.post("/api/goals", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const schema = z.object({
      title: z.string().min(1),
      category: z.string().default("overig"),
      description: z.string().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

    const goal = await storage.createGoal({ userId, ...parsed.data });
    res.status(201).json(goal);
  });

  app.get("/api/goals/:id", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const goal = await storage.getGoalById(req.params.id, userId);
    if (!goal) return res.status(404).json({ error: "Doel niet gevonden" });
    res.json(goal);
  });

  app.patch("/api/goals/:id", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const schema = z.object({
      title: z.string().min(1).optional(),
      category: z.string().optional(),
      description: z.string().optional(),
      archive: z.boolean().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

    const updateData: any = { ...parsed.data };
    if (parsed.data.archive === true) updateData.archivedAt = new Date();
    if (parsed.data.archive === false) updateData.archivedAt = null;
    delete updateData.archive;

    const goal = await storage.updateGoal(req.params.id, userId, updateData);
    if (!goal) return res.status(404).json({ error: "Doel niet gevonden" });
    res.json(goal);
  });

  app.delete("/api/goals/:id", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    await storage.deleteGoal(req.params.id, userId);
    res.json({ ok: true });
  });

  // --- G-ENTRIES ---
  app.get("/api/g-entries", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const { goal_id, from, to } = req.query as Record<string, string>;
    const entries = await storage.getGEntries(userId, {
      goalId: goal_id,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
    res.json(entries);
  });

  app.post("/api/g-entries", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const schema = z.object({
      goalId: z.string().uuid(),
      event: z.string().min(1),
      thoughts: z.string().min(1),
      feelings: z.array(z.object({ label: z.string(), intensity: z.number().min(0).max(100) })),
      behaviour: z.string().optional(),
      consequence: z.string().optional(),
      helpfulThought: z.string().optional(),
      helpsGoal: z.enum(["ja", "een_beetje", "nee"]).optional(),
      contextTags: z.array(z.string()).optional(),
      timestamp: z.string().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

    const entry = await storage.createGEntry({
      userId,
      ...parsed.data,
      timestamp: parsed.data.timestamp ? new Date(parsed.data.timestamp) : new Date(),
    });
    res.status(201).json(entry);
  });

  app.get("/api/g-entries/:id", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const entry = await storage.getGEntryById(req.params.id, userId);
    if (!entry) return res.status(404).json({ error: "Entry niet gevonden" });
    res.json(entry);
  });

  app.patch("/api/g-entries/:id", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const entry = await storage.updateGEntry(req.params.id, userId, req.body);
    if (!entry) return res.status(404).json({ error: "Entry niet gevonden" });
    res.json(entry);
  });

  // --- ACTIONS ---
  app.get("/api/actions", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const { goal_id, status } = req.query as Record<string, string>;
    const acts = await storage.getActions(userId, { goalId: goal_id, status });
    res.json(acts);
  });

  app.get("/api/actions/today", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const acts = await storage.getTodayActions(userId);
    res.json(acts);
  });

  app.post("/api/actions", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const schema = z.object({
      goalId: z.string().uuid(),
      gEntryId: z.string().uuid().optional(),
      ifSituation: z.string().min(1),
      thenBehaviour: z.string().min(1),
      status: z.enum(["planned", "done", "skipped"]).default("planned"),
      dueAt: z.string().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

    const action = await storage.createAction({
      userId,
      ...parsed.data,
      dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null,
    });
    res.status(201).json(action);
  });

  app.patch("/api/actions/:id", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const schema = z.object({
      status: z.enum(["planned", "done", "skipped"]).optional(),
      dueAt: z.string().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

    const action = await storage.updateAction(req.params.id, userId, parsed.data);
    if (!action) return res.status(404).json({ error: "Actie niet gevonden" });
    res.json(action);
  });

  // --- INSIGHTS ---
  app.get("/api/insights/emotions", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const range = parseInt((req.query.range as string)?.replace("d", "") ?? "7");
    const data = await storage.getEmotionInsights(userId, range);
    res.json(data);
  });

  app.get("/api/insights/goals-summary", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const data = await storage.getGoalsSummary(userId);
    res.json(data);
  });

  // --- NOTIFICATION PREFERENCES ---
  app.get("/api/notification-preferences", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const prefs = await storage.getNotificationPrefs(userId);
    res.json(prefs);
  });

  app.post("/api/notification-preferences", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const schema = z.object({
      channel: z.enum(["email", "push"]).default("email"),
      type: z.enum(["daily_checkin", "action_reminder"]),
      timeOfDay: z.string().default("08:00"),
      active: z.boolean().default(true),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

    const pref = await storage.createNotificationPref({ userId, ...parsed.data });
    res.status(201).json(pref);
  });

  app.patch("/api/notification-preferences/:id", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const pref = await storage.updateNotificationPref(req.params.id, userId, req.body);
    if (!pref) return res.status(404).json({ error: "Voorkeur niet gevonden" });
    res.json(pref);
  });
}

