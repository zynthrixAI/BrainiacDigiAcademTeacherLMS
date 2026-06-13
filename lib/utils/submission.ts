import type { Submission } from "@/types/submission";

export type GradeState = "ungraded" | "draft" | "released";

/**
 * `status="submitted"` is ambiguous (no grade OR a draft grade). Derive the real
 * UI state from the grade and its `released_at`.
 */
export function getGradeState(submission: Submission): GradeState {
  if (!submission.grade) return "ungraded";
  return submission.grade.released_at ? "released" : "draft";
}
