"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { connectZoom } from "@/lib/api/zoom";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { ZoomConnectPayload, ZoomStatus } from "@/types/zoom";

export function useConnectZoom() {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<ZoomStatus, Error, ZoomConnectPayload>({
    mutationFn: (payload) =>
      withAuthToken(cookies, (token) => connectZoom(token, payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.zoom.status });
    },
  });
}
