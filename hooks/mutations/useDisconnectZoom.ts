"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disconnectZoom } from "@/lib/api/zoom";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";

export function useDisconnectZoom() {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => withAuthToken(cookies, (token) => disconnectZoom(token)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.zoom.status });
    },
  });
}
