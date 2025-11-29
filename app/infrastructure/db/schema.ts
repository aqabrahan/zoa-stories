import { pgTable, uuid, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // References auth.users
  email: text("email").notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  creditsBalance: integer("credits_balance").default(2).notNull(),
  lastCreditReset: timestamp("last_credit_reset").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const stories = pgTable("stories", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => profiles.id),
  title: text("title"),
  content: text("content"),
  childName: text("child_name").notNull(),
  childAge: integer("child_age").notNull(),
  interests: text("interests").array().notNull(), // Using PG array
  theme: text("theme"),
  coverImageUrl: text("cover_image_url"),
  audioUrl: text("audio_url"),
  status: text("status").$type<'draft' | 'generating' | 'completed' | 'failed'>().default('draft').notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
