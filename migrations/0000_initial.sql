CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL UNIQUE,
  "password_hash" text NOT NULL,
  "name" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "goals" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "title" text NOT NULL,
  "category" text DEFAULT 'overig' NOT NULL,
  "description" text,
  "archived_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "g_entries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "goal_id" uuid NOT NULL,
  "timestamp" timestamp DEFAULT now() NOT NULL,
  "event" text NOT NULL,
  "thoughts" text NOT NULL,
  "feelings" jsonb NOT NULL,
  "behaviour" text,
  "consequence" text,
  "helpful_thought" text,
  "helps_goal" text,
  "context_tags" jsonb DEFAULT '[]',
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "actions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "goal_id" uuid NOT NULL,
  "g_entry_id" uuid,
  "if_situation" text NOT NULL,
  "then_behaviour" text NOT NULL,
  "status" text DEFAULT 'planned' NOT NULL,
  "due_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "notification_preferences" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "channel" text DEFAULT 'email' NOT NULL,
  "type" text NOT NULL,
  "time_of_day" text DEFAULT '08:00' NOT NULL,
  "active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
