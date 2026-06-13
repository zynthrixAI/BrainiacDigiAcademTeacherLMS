import type { LiveClassListParams } from "@/types/liveClass";

export const QUERY_KEYS = {
  auth: {
    session: ["auth", "session"] as const,
    currentTeacher: ["auth", "currentTeacher"] as const,
  },
  batches: {
    all: ["batches"] as const,
  },
  recordings: {
    root: ["recordings"] as const,
    list: ["recordings", "list"] as const,
  },
  assignments: {
    root: ["assignments"] as const,
    list: (batchId: string) => ["assignments", batchId] as const,
    detail: (assignmentId: string) =>
      ["assignments", "detail", assignmentId] as const,
  },
  submissions: {
    root: ["submissions"] as const,
    list: (assignmentId: string) => ["submissions", assignmentId] as const,
  },
  liveClasses: {
    /** Prefix matching every live-class query (used for broad invalidation). */
    root: ["liveClasses"] as const,
    list: (batchId: string, params: LiveClassListParams) =>
      ["liveClasses", batchId, params] as const,
    detail: (liveClassId: string) =>
      ["liveClasses", "detail", liveClassId] as const,
    attendance: (liveClassId: string) =>
      ["liveClasses", "attendance", liveClassId] as const,
  },
} as const;
