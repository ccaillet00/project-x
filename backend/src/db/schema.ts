import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const twitterTable = pgTable("twitter", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tweet: varchar({ length: 255 }).notNull(),
  userId: integer()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  sentiment: varchar({ length: 80 }),
  correction: varchar({ length: 1024 }),
  created: timestamp().defaultNow(),
});

export const userTable = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 100 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  created: timestamp().defaultNow(),
});
