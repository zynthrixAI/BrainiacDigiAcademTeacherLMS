import type {
  DashboardStat,
  EarningPoint,
  RecentSubmission,
  UpcomingClass,
} from "@/types/dashboard";
import type { Subject } from "@/types/subject";
import type { EarningsBreakdown, Payout } from "@/types/earning";

/**
 * Placeholder data for the teacher portal. The signed-in teacher's identity now
 * comes from the real profile route (`useTeacherProfile`); these remaining
 * collections will move to React Query hooks once their endpoints are wired up.
 */

export const DASHBOARD_STATS: DashboardStat[] = [
  {
    id: "students",
    label: "Active students",
    value: "248",
    delta: "18 new",
    deltaPositive: true,
    sub: "this month",
    icon: "user",
    accent: "#2a6fdb",
  },
  {
    id: "subjects",
    label: "Published subjects",
    value: "6",
    sub: "2 in draft",
    icon: "book",
    accent: "#7e57c2",
  },
  {
    id: "classes",
    label: "Live classes today",
    value: "3",
    sub: "1 live now · 2 scheduled",
    icon: "calendar",
    accent: "#ea580c",
  },
  {
    id: "earnings",
    label: "Earnings — June",
    value: "Rs. 312k",
    delta: "9.4%",
    deltaPositive: true,
    sub: "70% revenue share",
    icon: "wallet",
    accent: "#1f8a5b",
  },
  {
    id: "submissions",
    label: "Submissions to grade",
    value: "14",
    sub: "across 4 assignments",
    icon: "clipboard",
    accent: "#e23b3b",
  },
  {
    id: "rating",
    label: "Avg. rating",
    value: "4.8",
    delta: "0.2",
    deltaPositive: true,
    sub: "from 192 reviews",
    icon: "star",
    accent: "#f9c323",
  },
];

export const EARNINGS_TREND: EarningPoint[] = [
  { month: "Dec", amount: 186 },
  { month: "Jan", amount: 204 },
  { month: "Feb", amount: 198 },
  { month: "Mar", amount: 242 },
  { month: "Apr", amount: 268 },
  { month: "May", amount: 285 },
  { month: "Jun", amount: 312 },
];

export const TEACHER_SUBJECTS: Subject[] = [
  {
    id: "sub_chem_a",
    code: "CHEM",
    title: "A Level Chemistry",
    level: "A",
    color: "#1f8a5b",
    studentCount: 86,
    published: true,
  },
  {
    id: "sub_chem_o",
    code: "CHEM",
    title: "O Level Chemistry",
    level: "O",
    color: "#2a6fdb",
    studentCount: 74,
    published: true,
  },
  {
    id: "sub_bio_a",
    code: "BIO",
    title: "A Level Biology",
    level: "A",
    color: "#7e57c2",
    studentCount: 52,
    published: true,
  },
  {
    id: "sub_phys_o",
    code: "PHY",
    title: "O Level Physics",
    level: "O",
    color: "#ea580c",
    studentCount: 36,
    published: false,
  },
];

export const UPCOMING_CLASSES: UpcomingClass[] = [
  {
    id: "lc_1",
    title: "Organic Chemistry — Aldol Reactions",
    subjectCode: "CHEM",
    color: "#1f8a5b",
    batch: "A2 · Batch C",
    when: "Live now",
    status: "live",
    durationMins: 60,
  },
  {
    id: "lc_2",
    title: "Atomic Structure — Mass Spectrometry",
    subjectCode: "CHEM",
    color: "#2a6fdb",
    batch: "O · Batch A",
    when: "Today, 2:30 PM",
    status: "scheduled",
    durationMins: 45,
  },
  {
    id: "lc_3",
    title: "Genetics — Dihybrid Crosses",
    subjectCode: "BIO",
    color: "#7e57c2",
    batch: "A2 · Batch B",
    when: "Today, 4:00 PM",
    status: "scheduled",
    durationMins: 60,
  },
  {
    id: "lc_4",
    title: "Electricity — Resistance & Ohm's Law",
    subjectCode: "PHY",
    color: "#ea580c",
    batch: "O · Batch D",
    when: "Tomorrow, 11:00 AM",
    status: "scheduled",
    durationMins: 45,
  },
];

export const RECENT_SUBMISSIONS: RecentSubmission[] = [
  {
    id: "sm_1",
    studentName: "Ayesha Tariq",
    studentInitials: "AT",
    assignmentTitle: "Titration Lab Report",
    subjectCode: "CHEM",
    submittedAt: "2h ago",
    status: "pending",
  },
  {
    id: "sm_2",
    studentName: "Hamza Sheikh",
    studentInitials: "HS",
    assignmentTitle: "Bonding Worksheet 4",
    subjectCode: "CHEM",
    submittedAt: "5h ago",
    status: "pending",
  },
  {
    id: "sm_3",
    studentName: "Fatima Noor",
    studentInitials: "FN",
    assignmentTitle: "Cell Division Quiz",
    subjectCode: "BIO",
    submittedAt: "Yesterday",
    status: "pending",
  },
  {
    id: "sm_4",
    studentName: "Bilal Anwar",
    studentInitials: "BA",
    assignmentTitle: "Kinematics Problem Set",
    subjectCode: "PHY",
    submittedAt: "Yesterday",
    status: "graded",
  },
];

export const EARNINGS_BREAKDOWN: EarningsBreakdown[] = [
  { subject: "A Level Chemistry", amount: 142000, share: 70 },
  { subject: "O Level Chemistry", amount: 96000, share: 70 },
  { subject: "A Level Biology", amount: 54000, share: 70 },
  { subject: "O Level Physics", amount: 20000, share: 70 },
];

export const PAYOUTS: Payout[] = [
  {
    id: "po_jun",
    period: "June 2026",
    amount: 312000,
    students: 248,
    status: "pending",
    date: "Due 5 Jul 2026",
  },
  {
    id: "po_may",
    period: "May 2026",
    amount: 285000,
    students: 236,
    status: "processed",
    date: "Paid 4 Jun 2026",
  },
  {
    id: "po_apr",
    period: "April 2026",
    amount: 268000,
    students: 224,
    status: "processed",
    date: "Paid 5 May 2026",
  },
  {
    id: "po_mar",
    period: "March 2026",
    amount: 242000,
    students: 210,
    status: "processed",
    date: "Paid 4 Apr 2026",
  },
];

