import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uuid: text("uuid").notNull(),
  authenticatorId: integer("authenticator_id").references(() => authenticator.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  challenge: text("challenge"),
  jwt_id: text("jwt_id"),
  active: integer("active", { mode: "boolean" }).notNull(),
  isAdmin: integer("isAdmin", { mode: "boolean" }),
  metadata: text("metadata", { mode: "json" }),
  appdata: text("appdata", { mode: "json" }),
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
});

export const authenticator = sqliteTable("authenticator", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  credentialID: text("credentialID").notNull(),
  credentialPublicKey: text("credentialPublicKey").notNull(),
  counter: integer("counter").notNull(),
  transports: text("transports"),
});

export const storage = sqliteTable("storage", {
  sessionID: text("sessionID").primaryKey(),
  data: text("data").notNull(),
});
