import { AUTH_COOKIES, AUTH_COOKIE_MAX_AGE } from "@/lib/constants";
import type { TeacherTokens } from "@/types/auth";
import type { CookieOptions } from "@/types/cookies";

type SetCookieFn = (
  name: string,
  value: string,
  options?: CookieOptions,
) => Promise<void> | void;

type DeleteCookieFn = (name: string) => Promise<void> | void;

function authCookieOptions(maxAge: number): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

/** Store the token pair as httpOnly, secure cookies via the cookies hook. */
export async function persistAuthTokens(
  setCookie: SetCookieFn,
  tokens: TeacherTokens,
): Promise<void> {
  await setCookie(
    AUTH_COOKIES.accessToken,
    tokens.access_token,
    authCookieOptions(AUTH_COOKIE_MAX_AGE.accessToken),
  );
  await setCookie(
    AUTH_COOKIES.refreshToken,
    tokens.refresh_token,
    authCookieOptions(AUTH_COOKIE_MAX_AGE.refreshToken),
  );
}

/** Remove both auth cookies via the cookies hook (sign out / dead session). */
export async function clearAuthTokens(
  deleteCookie: DeleteCookieFn,
): Promise<void> {
  await deleteCookie(AUTH_COOKIES.accessToken);
  await deleteCookie(AUTH_COOKIES.refreshToken);
}
