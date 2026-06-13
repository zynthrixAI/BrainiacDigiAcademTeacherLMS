export type PayoutStatus = "pending" | "processed";

export interface Payout {
  id: string;
  period: string;
  amount: number;
  students: number;
  status: PayoutStatus;
  date: string;
}

export interface EarningsBreakdown {
  subject: string;
  amount: number;
  share: number;
}
