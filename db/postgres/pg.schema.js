import { sql } from "drizzle-orm";
import { pgTable, serial, integer, text, timestamp, boolean, json } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uuid: text("uuid").notNull(),
  authenticatorId: integer("authenticator_id").references(() => authenticator.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  challenge: text("challenge"),
  jwt_id: text("jwt_id"),
  active: boolean("active").notNull(),
  isAdmin: boolean("isAdmin"),
  metadata: json("metadata"),
  appdata: json("appdata"),
  created_at: timestamp("created_at", { mode: "string" }).notNull(),
  updated_at: timestamp("updated_at", { mode: "string" }).notNull(),
});

export const authenticator = pgTable("authenticator", {
  id: serial("id").primaryKey(),
  credentialID: text("credentialID").notNull(),
  credentialPublicKey: text("credentialPublicKey").notNull(),
  counter: integer("counter").notNull(),
  transports: text("transports"),
});

export const storage = pgTable("storage", {
  sessionID: text("sessionID").primaryKey(),
  data: text("data").notNull(),
});
