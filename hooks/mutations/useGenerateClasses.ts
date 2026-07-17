"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateClasses } from "@/lib/api/liveClasses";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type {
  ClassGeneratePayload,
  ClassGenerateResponse,
} from "@/types/liveClass";

/**
 * Create the teacher's confirmed series in one call, then refresh every
 * live-class list. batchId travels in the variables so one instance serves the
 * global page's batch selector as well as a batch-scoped view.
 */
export function useGenerateClasses() {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<
    ClassGenerateResponse,
    Error,
    { batchId: string; payload: ClassGeneratePayload }
  >({
    mutationFn: ({ batchId, payload }) =>
      withAuthToken(cookies, (token) =>
        generateClasses(token, batchId, payload),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.liveClasses.root });
    },
  });
}
