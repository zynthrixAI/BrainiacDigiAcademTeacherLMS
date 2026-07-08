export const APP_NAME = "BDA Teacher Portal";

/** Backend host. Set `NEXT_PUBLIC_API_URL` in `.env.local`. */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/** All teacher-facing endpoints are namespaced under this prefix. */
export const TEACHER_API_PREFIX = "/api/teachers";

/** Public CloudFront base for S3-stored files (submissions, attachments). */
export const CDN_BASE = "https://d16n475lmoy1b6.cloudfront.net";

/** httpOnly cookie names holding the auth tokens. */
export const AUTH_COOKIES = {
  accessToken: "bda_teacher_access_token",
  refreshToken: "bda_teacher_refresh_token",
} as const;

/** Cookie lifetimes (seconds). */
export const AUTH_COOKIE_MAX_AGE = {
  accessToken: 60 * 60 * 24, // 1 day — rotated via /refresh when it expires
  refreshToken: 60 * 60 * 24 * 30, // 30 days
} as const;

export const ROUTES = {
  login: "/login",
  forgotPassword: "/forgot-password",
  batches: "/batches",
  liveClasses: "/live-classes",
  recordings: "/recordings",
  assignments: "/assignments",
  questions: "/questions",
} as const;

export const AUTH_BRAND = {
  initial: "B",
  name: "BDA Teaching",
  subtitle: "Educator console",
  badge: "Teacher access",
  headlineLead: "Teach brilliantly.",
  headlineAccent: "One workspace.",
  description:
    "Schedule live classes, publish recordings, grade assignments, and track your payouts — all from a single educator workspace.",
  copyright: "© 2026 BDA · Karachi, PK",
} as const;
