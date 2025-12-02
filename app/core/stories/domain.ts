export type StoryStatus = 'draft' | 'generating' | 'completed' | 'failed';

export interface Story {
  id: string;
  userId: string | null; // Nullable for guests
  title: string;
  content: string;
  childName: string;
  childAge: number;
  interests: string[];
  theme: string;
  coverImageUrl?: string;
  audioUrl?: string;
  status: StoryStatus;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStoryParams {
  userId?: string | null; // Optional
  childName: string;
  childAge: number;
  interests: string[];
  theme?: string;
}

export interface StoryRepository {
  create(story: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>): Promise<Story>;
  findById(id: string): Promise<Story | null>;
  findByUserId(userId: string): Promise<Story[]>;
  update(id: string, data: Partial<Story>): Promise<Story>;
}
