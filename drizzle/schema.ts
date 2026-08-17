import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  json,
  boolean,
} from "drizzle-orm/mysql-core";

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Theme Config Type ────────────────────────────────────────────────────────
export interface ThemeConfig {
  colorBackground?: string;
  colorSurface?: string;
  colorTextPrimary?: string;
  colorTextSecondary?: string;
  colorPrimary?: string;
  colorSecondary?: string;
  colorAccent?: string;
  colorBorder?: string;
  colorFocus?: string;
  fontHeading?: string;
  fontBody?: string;
  fontSizeBase?: string;
  lineHeightBase?: string;
  letterSpacingHeading?: string;
  radiusNone?: string;
  radiusSm?: string;
  radiusMd?: string;
  radiusLg?: string;
  radiusFull?: string;
  borderWidth?: string;
  shadowSm?: string;
  shadowMd?: string;
  shadowLg?: string;
  maxWidth?: string;
  gridColumns?: string;
  gapBase?: string;
  motionFast?: string;
  motionNormal?: string;
  motionSlow?: string;
  motionEasing?: string;
  ctaViewProject?: string;
  ctaSendMessage?: string;
}

// ─── Portfolio Settings ────────────────────────────────────────────────────────
export const portfolioSettings = mysqlTable("portfolio_settings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  portfolioName: varchar("portfolioName", { length: 255 }).notNull().default("Meu Portfólio"),
  tagline: varchar("tagline", { length: 500 }).default(""),
  aboutTitle: varchar("aboutTitle", { length: 255 }).default("Sobre"),
  aboutText: text("aboutText").default(""),
  shortBio: text("shortBio").default(""),
  profileImageUrl: text("profileImageUrl").default(""),
  profileImageKey: text("profileImageKey").default(""),
  whatsapp: varchar("whatsapp", { length: 30 }).default(""),
  emailPublic: varchar("emailPublic", { length: 320 }).default(""),
  location: varchar("location", { length: 255 }).default(""),
  socialLinks: json("socialLinks").$type<Array<{ label: string; url: string }>>().default([]),
  contactIntro: text("contactIntro").default(""),
  uxVoice: varchar("uxVoice", { length: 64 }).default("direto"),
  themeConfig: json("themeConfig").$type<ThemeConfig>().default({}),
  faviconUrl: text("faviconUrl").default(""),
  faviconKey: text("faviconKey").default(""),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortfolioSettings = typeof portfolioSettings.$inferSelect;
export type InsertPortfolioSettings = typeof portfolioSettings.$inferInsert;

// ─── Categories ───────────────────────────────────────────────────────────────
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description").default(""),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// ─── Projects ─────────────────────────────────────────────────────────────────
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  categoryId: int("categoryId"),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  shortDescription: text("shortDescription").default(""),
  coverImageUrl: text("coverImageUrl").default(""),
  coverImageKey: text("coverImageKey").default(""),
  coverImageAlt: varchar("coverImageAlt", { length: 500 }).default(""),
  year: varchar("year", { length: 10 }).default(""),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  featured: boolean("featured").default(false).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  metaDescription: text("metaDescription").default(""),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// ─── Project Blocks ───────────────────────────────────────────────────────────
export const projectBlocks = mysqlTable("project_blocks", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["text", "image", "youtube", "audio"]).notNull(),
  content: text("content").default(""),
  mediaUrl: text("mediaUrl").default(""),
  mediaKey: text("mediaKey").default(""),
  altText: varchar("altText", { length: 500 }).default(""),
  caption: text("caption").default(""),
  transcript: text("transcript").default(""),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProjectBlock = typeof projectBlocks.$inferSelect;
export type InsertProjectBlock = typeof projectBlocks.$inferInsert;
