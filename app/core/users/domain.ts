export interface UserProfile {
  id: string; // Matches Auth Provider ID
  email: string;
  fullName?: string;
  avatarUrl?: string;
  creditsBalance: number;
  lastCreditReset: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRepository {
  findById(id: string): Promise<UserProfile | null>;
  create(profile: Omit<UserProfile, 'createdAt' | 'updatedAt' | 'lastCreditReset'>): Promise<UserProfile>;
  update(id: string, data: Partial<UserProfile>): Promise<void>;
  updateCredits(id: string, newBalance: number): Promise<void>;
}
