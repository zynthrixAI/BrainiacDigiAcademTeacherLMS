"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startLiveClass } from "@/lib/api/liveClasses";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { LiveClass } from "@/types/liveClass";

export function useStartLiveClass() {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<LiveClass, Error, string>({
    mutationFn: (liveClassId) =>
      withAuthToken(cookies, (token) => startLiveClass(token, liveClassId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.liveClasses.root });
    },
  });
}
