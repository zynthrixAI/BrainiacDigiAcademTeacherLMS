import { isAxiosError } from "axios";

/**
 * Translate a backend auth error into a user-facing message. The API uses
 * FastAPI-style `{ detail: string }` bodies, so prefer that; fall back to
 * status-code defaults from the spec.
 */
export function extractAuthError(error: unknown): string {
  if (isAxiosError(error)) {
    const detail = (error.response?.data as { detail?: unknown } | undefined)
      ?.detail;
    if (typeof detail === "string") return detail;

    switch (error.response?.status) {
      case 401:
        return "Invalid credentials";
      case 403:
        return "Account is inactive";
      case 404:
        return "Email not registered";
      case 422:
        return "Please enter a valid email address";
    }
  }
  return "Something went wrong. Please try again.";
}
