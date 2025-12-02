import { eq } from "drizzle-orm";
import { db } from "../client";
import { profiles } from "../schema";
import type { UserProfile, UserRepository } from "../../../core/users/domain";

export class DrizzleUserRepository implements UserRepository {
  async findById(id: string): Promise<UserProfile | null> {
    const [row] = await db.select().from(profiles).where(eq(profiles.id, id));
    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      creditsBalance: row.creditsBalance,
      lastCreditReset: row.lastCreditReset,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async create(profile: Omit<UserProfile, 'createdAt' | 'updatedAt' | 'lastCreditReset'>): Promise<UserProfile> {
    const [inserted] = await db.insert(profiles).values({
      id: profile.id,
      email: profile.email,
      creditsBalance: profile.creditsBalance,
    }).returning();

    return {
      id: inserted.id,
      email: inserted.email,
      creditsBalance: inserted.creditsBalance,
      lastCreditReset: inserted.lastCreditReset,
      createdAt: inserted.createdAt,
      updatedAt: inserted.updatedAt,
    };
  }

  async update(id: string, data: Partial<UserProfile>): Promise<void> {
    await db.update(profiles).set({
      ...data,
      updatedAt: new Date(),
    }).where(eq(profiles.id, id));
  }

  async updateCredits(id: string, newBalance: number): Promise<void> {
    await db.update(profiles).set({
      creditsBalance: newBalance,
      updatedAt: new Date(),
    }).where(eq(profiles.id, id));
  }
}
