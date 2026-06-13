"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLiveClass } from "@/lib/api/liveClasses";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { LiveClass, LiveClassCreatePayload } from "@/types/liveClass";

export function useCreateLiveClass(batchId: string) {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<LiveClass, Error, LiveClassCreatePayload>({
    mutationFn: (payload) =>
      withAuthToken(cookies, (token) =>
        createLiveClass(token, batchId, payload),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.liveClasses.root });
    },
  });
}
