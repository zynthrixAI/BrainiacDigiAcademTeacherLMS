"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLiveClass } from "@/lib/api/liveClasses";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { LiveClass, LiveClassUpdatePayload } from "@/types/liveClass";

interface UpdateLiveClassVariables {
  id: string;
  payload: LiveClassUpdatePayload;
}

export function useUpdateLiveClass() {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<LiveClass, Error, UpdateLiveClassVariables>({
    mutationFn: ({ id, payload }) =>
      withAuthToken(cookies, (token) => updateLiveClass(token, id, payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.liveClasses.root });
    },
  });
}
