export type StoryStatus = 'draft' | 'generating' | 'completed' | 'failed';

export interface Story {
  id: string;
  userId: string;
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
  userId: string;
  childName: string;
  childAge: number;
  interests: string[];
  theme?: string;
}

export interface StoryRepository {
  create(story: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>): Promise<Story>;
  findById(id: string): Promise<Story | null>;
  update(id: string, data: Partial<Story>): Promise<Story>;
  findByUser(userId: string): Promise<Story[]>;
}
