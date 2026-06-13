import { isAxiosError } from "axios";
import { refreshTeacherToken } from "@/lib/api/auth";
import { persistAuthTokens, clearAuthTokens } from "@/lib/utils/authCookies";
import { AUTH_COOKIES } from "@/lib/constants";
import type { CookieOptions } from "@/types/cookies";

export const SESSION_EXPIRED = "Your session has expired. Please sign in again.";

interface CookieApi {
  getCookie: (name: string) => Promise<string | undefined> | string | undefined;
  setCookie: (
    name: string,
    value: string,
    options?: CookieOptions,
  ) => Promise<void> | void;
  deleteCookie: (name: string) => Promise<void> | void;
}

/**
 * Shared in-flight refresh. The refresh token is single-use (rotated on every
 * call), so concurrent 401s must NOT each hit `/refresh` — the second would use
 * the already-rotated token and the backend would revoke the session. We keep a
 * single promise so all callers await the same rotation.
 */
let inFlightRefresh: Promise<string> | null = null;

async function performRefresh(cookies: CookieApi): Promise<string> {
  const refreshToken = await cookies.getCookie(AUTH_COOKIES.refreshToken);
  if (!refreshToken) throw new Error(SESSION_EXPIRED);
  try {
    const tokens = await refreshTeacherToken({ refresh_token: refreshToken });
    await persistAuthTokens(cookies.setCookie, tokens);
    return tokens.access_token;
  } catch {
    await clearAuthTokens(cookies.deleteCookie);
    throw new Error(SESSION_EXPIRED);
  }
}

function refreshAccessToken(cookies: CookieApi): Promise<string> {
  if (!inFlightRefresh) {
    inFlightRefresh = performRefresh(cookies).finally(() => {
      inFlightRefresh = null;
    });
  }
  return inFlightRefresh;
}

/**
 * Run an authenticated request with the access token from the cookies, and
 * transparently refresh + retry once on a 401. Centralises the access-token
 * lifecycle so every query/mutation hook stays a one-liner. Concurrent refreshes
 * are de-duplicated so the rotating refresh token is only ever used once.
 */
export async function withAuthToken<T>(
  cookies: CookieApi,
  request: (accessToken: string) => Promise<T>,
): Promise<T> {
  let accessToken = await cookies.getCookie(AUTH_COOKIES.accessToken);
  if (!accessToken) accessToken = await refreshAccessToken(cookies);

  try {
    return await request(accessToken);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      const newAccessToken = await refreshAccessToken(cookies);
      return request(newAccessToken);
    }
    throw error;
  }
}
