"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLiveClass } from "@/lib/api/liveClasses";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";

export function useDeleteLiveClass() {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (liveClassId) =>
      withAuthToken(cookies, (token) => deleteLiveClass(token, liveClassId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.liveClasses.root });
    },
  });
}
