/** Subset of Next.js cookie options accepted by `cookies().set(name, value, options)`. */
export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: boolean | "lax" | "strict" | "none";
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: Date | number;
  priority?: "low" | "medium" | "high";
}
