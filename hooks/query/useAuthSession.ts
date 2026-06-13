"use client";

import { useQuery } from "@tanstack/react-query";
import { useCookies } from "@/hooks/useCookies";
import { AUTH_COOKIES } from "@/lib/constants";
import { QUERY_KEYS } from "@/lib/queryKeys";

/**
 * Client-side check for whether the teacher has an active session, based on the
 * presence of the refresh-token cookie (read through the cookies hook).
 */
export function useAuthSession() {
  const { getCookie } = useCookies();

  return useQuery<boolean>({
    queryKey: QUERY_KEYS.auth.session,
    queryFn: async () => Boolean(await getCookie(AUTH_COOKIES.refreshToken)),
    retry: false,
  });
}
