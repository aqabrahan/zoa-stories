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
  create(user: UserProfile): Promise<UserProfile>;
  updateCredits(id: string, newBalance: number): Promise<void>;
}
