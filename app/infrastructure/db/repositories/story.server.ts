import { eq, desc } from "drizzle-orm";
import { db } from "../client";
import { stories } from "../schema";
import type { StoryRepository, Story } from "../../../core/stories/domain";

// Helper to map DB result to Domain Entity
const mapToDomain = (row: typeof stories.$inferSelect): Story => ({
  ...row,
  interests: row.interests as string[], // Cast array type
  status: row.status as Story['status'],
  title: row.title ?? "",
  theme: row.theme || "pixar",
  coverImageUrl: row.coverImageUrl || undefined,
  audioUrl: row.audioUrl || undefined,
  content: row.content ?? "",
  // Ensure dates are Date objects
  createdAt: new Date(row.createdAt),
  updatedAt: new Date(row.updatedAt),
});

export class DrizzleStoryRepository implements StoryRepository {
  async create(storyData: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>): Promise<Story> {
    const [inserted] = await db.insert(stories).values({
      userId: storyData.userId || null, // Ensure null if undefined/empty
      childName: storyData.childName,
      childAge: storyData.childAge,
      interests: storyData.interests,
      theme: storyData.theme,
      status: storyData.status,
      isPublic: storyData.isPublic,
    }).returning();

    return mapToDomain(inserted);
  }

  async findById(id: string): Promise<Story | null> {
    const [row] = await db.select().from(stories).where(eq(stories.id, id));
    return row ? mapToDomain(row) : null;
  }

  async update(id: string, data: Partial<Story>): Promise<Story> {
    const [updated] = await db
      .update(stories)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(stories.id, id))
      .returning();

    if (!updated) {
      throw new Error(`Story with id ${id} not found`);
    }

    return mapToDomain(updated);
  }

  async findByUser(userId: string): Promise<Story[]> {
    const rows = await db
      .select()
      .from(stories)
      .where(eq(stories.userId, userId))
      .orderBy(desc(stories.createdAt));

    return rows.map(mapToDomain);
  }
}
