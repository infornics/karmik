import {
  pgTable,
  uuid,
  integer,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const karmaEntries = pgTable("karma_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  type: varchar("type", { length: 10 }).notNull(), // "good" | "bad"
  points: integer("points").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type KarmaEntry = typeof karmaEntries.$inferSelect;
export type NewKarmaEntry = typeof karmaEntries.$inferInsert;

