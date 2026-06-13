"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelLiveClass } from "@/lib/api/liveClasses";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { LiveClass } from "@/types/liveClass";

interface CancelLiveClassVariables {
  id: string;
  cancel_reason: string;
}

export function useCancelLiveClass() {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<LiveClass, Error, CancelLiveClassVariables>({
    mutationFn: ({ id, cancel_reason }) =>
      withAuthToken(cookies, (token) =>
        cancelLiveClass(token, id, { cancel_reason }),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.liveClasses.root });
    },
  });
}
