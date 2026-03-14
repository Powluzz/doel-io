import { pgTable, text, uuid, timestamp, jsonb, integer, boolean, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Goals
export const goals = pgTable("goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull().default("overig"), // werk, relaties, gezondheid, zelfbeeld, overig
  description: text("description"),
  archivedAt: timestamp("archived_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGoalSchema = createInsertSchema(goals).omit({ id: true, createdAt: true, archivedAt: true });
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;

// G-schema Entries
export const gEntries = pgTable("g_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  goalId: uuid("goal_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  event: text("event").notNull(),
  thoughts: text("thoughts").notNull(),
  feelings: jsonb("feelings").notNull().$type<Array<{ label: string; intensity: number }>>(),
  behaviour: text("behaviour"),
  consequence: text("consequence"),
  helpfulThought: text("helpful_thought"),
  helpsGoal: text("helps_goal"), // "ja", "een_beetje", "nee"
  contextTags: jsonb("context_tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGEntrySchema = createInsertSchema(gEntries).omit({ id: true, createdAt: true });
export type InsertGEntry = z.infer<typeof insertGEntrySchema>;
export type GEntry = typeof gEntries.$inferSelect;

// Actions (If-Then)
export const actions = pgTable("actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  goalId: uuid("goal_id").notNull(),
  gEntryId: uuid("g_entry_id"),
  ifSituation: text("if_situation").notNull(),
  thenBehaviour: text("then_behaviour").notNull(),
  status: text("status").notNull().default("planned"), // planned, done, skipped
  dueAt: timestamp("due_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActionSchema = createInsertSchema(actions).omit({ id: true, createdAt: true });
export type InsertAction = z.infer<typeof insertActionSchema>;
export type Action = typeof actions.$inferSelect;

// Notification Preferences
export const notificationPreferences = pgTable("notification_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  channel: text("channel").notNull().default("email"), // email, push
  type: text("type").notNull(), // daily_checkin, action_reminder
  timeOfDay: text("time_of_day").notNull().default("08:00"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNotificationPrefSchema = createInsertSchema(notificationPreferences).omit({ id: true, createdAt: true });
export type InsertNotificationPref = z.infer<typeof insertNotificationPrefSchema>;
export type NotificationPref = typeof notificationPreferences.$inferSelect;
