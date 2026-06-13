"use server";

import { cookies } from "next/headers";
import type { CookieOptions } from "@/types/cookies";

/** Set a cookie on the server with the given Next.js cookie options. */
export async function setCookie(
  name: string,
  value: string,
  options?: CookieOptions,
): Promise<void> {
  const store = await cookies();
  store.set(name, value, options);
}

/** Read a cookie value on the server. Returns `undefined` when absent. */
export async function getCookie(name: string): Promise<string | undefined> {
  const store = await cookies();
  return store.get(name)?.value;
}

/** Delete a cookie on the server. */
export async function deleteCookie(name: string): Promise<void> {
  const store = await cookies();
  store.delete(name);
}
