export const MONTHLY_FREE_CREDITS = 2;

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number; // Negative for usage, positive for refill
  reason: 'monthly_reset' | 'story_generation' | 'purchase';
  createdAt: Date;
}

export interface BillingService {
  checkCredits(userId: string): Promise<boolean>;
  deductCredit(userId: string): Promise<void>;
  resetMonthlyCredits(userId: string): Promise<void>;
}
