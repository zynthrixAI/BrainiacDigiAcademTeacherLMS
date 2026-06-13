
"use client";

import { useMemo } from "react";
import { setCookie, getCookie, deleteCookie } from "@/lib/actions/cookies";
import type { CookieOptions } from "@/types/cookies";

/**
 * Client hook exposing the cookie server actions. Lets client components set,
 * read, and delete httpOnly/secure cookies without touching `next/headers`.
 */
export const useCookies = () =>
  useMemo(
    () => ({
      setCookie: (name: string, value: string, options?: CookieOptions) =>
        setCookie(name, value, options),
      getCookie: (name: string) => getCookie(name),
      deleteCookie: (name: string) => deleteCookie(name),
    }),
    [],
  );
