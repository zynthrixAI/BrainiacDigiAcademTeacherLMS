import { isAxiosError } from "axios";

/**
 * Extract a user-facing message from an API error. Handles FastAPI's
 * `{ detail: string }` bodies and 422 validation arrays, then falls back to a
 * plain Error message (e.g. the session-expired error), then the fallback.
 */
export function extractApiError(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (isAxiosError(error)) {
    const detail = (error.response?.data as { detail?: unknown } | undefined)
      ?.detail;
    if (typeof detail === "string") return detail;
    if (
      Array.isArray(detail) &&
      detail.length > 0 &&
      typeof (detail[0] as { msg?: unknown })?.msg === "string"
    ) {
      return (detail[0] as { msg: string }).msg;
    }
    return fallback;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
