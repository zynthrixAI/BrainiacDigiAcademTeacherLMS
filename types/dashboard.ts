export type StatIconName =
  | "user"
  | "book"
  | "calendar"
  | "wallet"
  | "clipboard"
  | "star";

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  sub: string;
  icon: StatIconName;
  accent: string;
}

export interface EarningPoint {
  month: string;
  /** Earnings in thousands of PKR. */
  amount: number;
}

export type RecentSubmissionStatus = "pending" | "graded";

/** Simplified display model for the dashboard's "submissions to grade" widget. */
export interface RecentSubmission {
  id: string;
  studentName: string;
  studentInitials: string;
  assignmentTitle: string;
  subjectCode: string;
  submittedAt: string;
  status: RecentSubmissionStatus;
}

export type UpcomingClassStatus = "live" | "scheduled" | "ended";

/** Simplified display model for the dashboard's "today's classes" widget. */
export interface UpcomingClass {
  id: string;
  title: string;
  subjectCode: string;
  color: string;
  batch: string;
  /** Human-readable schedule label, e.g. "Live now" or "Today, 2:30 PM". */
  when: string;
  status: UpcomingClassStatus;
  durationMins: number;
}
