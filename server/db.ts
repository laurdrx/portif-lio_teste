import { and, asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  portfolioSettings,
  categories,
  projects,
  projectBlocks,
  type InsertPortfolioSettings,
  type InsertCategory,
  type InsertProject,
  type InsertProjectBlock,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  const updateSet: Record<string, unknown> = {};
  const values: InsertUser = { openId: user.openId };
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function listUsersForAdmin() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(users).orderBy(asc(users.createdAt));
}

export async function setUserRole(id: number, role: "user" | "admin") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ role }).where(eq(users.id, id));
  return getUserById(id);
}

// ─── Portfolio Settings ────────────────────────────────────────────────────────
export async function getOrCreateSettings(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(portfolioSettings).where(eq(portfolioSettings.userId, userId)).limit(1);
  if (existing[0]) return existing[0];
  await db.insert(portfolioSettings).values({ userId });
  const created = await db.select().from(portfolioSettings).where(eq(portfolioSettings.userId, userId)).limit(1);
  return created[0]!;
}

export async function updateSettings(userId: number, data: Partial<InsertPortfolioSettings>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await getOrCreateSettings(userId);
  await db.update(portfolioSettings).set(data).where(eq(portfolioSettings.userId, userId));
  return getOrCreateSettings(userId);
}

export async function getPublicSettings(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(portfolioSettings).where(eq(portfolioSettings.userId, userId)).limit(1);
  return result[0] ?? null;
}

// ─── Categories ───────────────────────────────────────────────────────────────
export async function getCategoriesByUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(categories).where(eq(categories.userId, userId)).orderBy(asc(categories.displayOrder));
}

export async function createCategory(data: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(categories).values(data).$returningId();
  const created = await db.select().from(categories).where(eq(categories.id, result!.id)).limit(1);
  return created[0]!;
}

export async function updateCategory(id: number, userId: number, data: Partial<InsertCategory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(categories).set(data).where(and(eq(categories.id, id), eq(categories.userId, userId)));
  const updated = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return updated[0]!;
}

export async function deleteCategory(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(categories).where(and(eq(categories.id, id), eq(categories.userId, userId)));
}

export async function moveCategoryProjects(fromCategoryId: number, toCategoryId: number | null, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(projects).set({ categoryId: toCategoryId }).where(and(eq(projects.categoryId, fromCategoryId), eq(projects.userId, userId)));
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export async function getProjectsByUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(projects).where(eq(projects.userId, userId)).orderBy(asc(projects.displayOrder));
}

export async function getPublishedProjects(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(projects).where(and(eq(projects.userId, userId), eq(projects.status, "published"))).orderBy(asc(projects.displayOrder));
}

export async function getProjectBySlug(slug: string, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(projects).where(and(eq(projects.slug, slug), eq(projects.userId, userId))).limit(1);
  return result[0] ?? null;
}

export async function getProjectById(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(projects).where(and(eq(projects.id, id), eq(projects.userId, userId))).limit(1);
  return result[0] ?? null;
}

export async function createProject(data: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(projects).values(data).$returningId();
  const created = await db.select().from(projects).where(eq(projects.id, result!.id)).limit(1);
  return created[0]!;
}

export async function updateProject(id: number, userId: number, data: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(projects).set(data).where(and(eq(projects.id, id), eq(projects.userId, userId)));
  const updated = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return updated[0]!;
}

export async function deleteProject(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(projectBlocks).where(and(eq(projectBlocks.projectId, id), eq(projectBlocks.userId, userId)));
  await db.delete(projects).where(and(eq(projects.id, id), eq(projects.userId, userId)));
}

// ─── Project Blocks ───────────────────────────────────────────────────────────
export async function getBlocksByProject(projectId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(projectBlocks).where(and(eq(projectBlocks.projectId, projectId), eq(projectBlocks.userId, userId))).orderBy(asc(projectBlocks.displayOrder));
}

export async function getPublicBlocksByProject(projectId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(projectBlocks).where(eq(projectBlocks.projectId, projectId)).orderBy(asc(projectBlocks.displayOrder));
}

export async function createBlock(data: InsertProjectBlock) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(projectBlocks).values(data).$returningId();
  const created = await db.select().from(projectBlocks).where(eq(projectBlocks.id, result!.id)).limit(1);
  return created[0]!;
}

export async function updateBlock(id: number, userId: number, data: Partial<InsertProjectBlock>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(projectBlocks).set(data).where(and(eq(projectBlocks.id, id), eq(projectBlocks.userId, userId)));
  const updated = await db.select().from(projectBlocks).where(eq(projectBlocks.id, id)).limit(1);
  return updated[0]!;
}

export async function deleteBlock(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(projectBlocks).where(and(eq(projectBlocks.id, id), eq(projectBlocks.userId, userId)));
}

export async function reorderBlocks(projectId: number, userId: number, orderedIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await Promise.all(orderedIds.map((id, idx) =>
    db.update(projectBlocks).set({ displayOrder: idx }).where(and(eq(projectBlocks.id, id), eq(projectBlocks.projectId, projectId), eq(projectBlocks.userId, userId)))
  ));
}

export async function reorderProjects(userId: number, orderedIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await Promise.all(orderedIds.map((id, idx) =>
    db.update(projects).set({ displayOrder: idx }).where(and(eq(projects.id, id), eq(projects.userId, userId)))
  ));
}

export async function reorderCategories(userId: number, orderedIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await Promise.all(orderedIds.map((id, idx) =>
    db.update(categories).set({ displayOrder: idx }).where(and(eq(categories.id, id), eq(categories.userId, userId)))
  ));
}
