import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});


export const twitterTable = pgTable("twitter", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tweet: varchar({ length: 255 }).notNull(),
  userId: integer()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const userTable = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
});