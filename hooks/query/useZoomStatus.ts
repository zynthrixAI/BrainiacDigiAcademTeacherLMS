"use client";

import { useQuery } from "@tanstack/react-query";
import { getZoomStatus } from "@/lib/api/zoom";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { ZoomStatus } from "@/types/zoom";

export function useZoomStatus() {
  const cookies = useCookies();

  return useQuery<ZoomStatus>({
    queryKey: QUERY_KEYS.zoom.status,
    queryFn: () => withAuthToken(cookies, (token) => getZoomStatus(token)),
    retry: false,
  });
}
