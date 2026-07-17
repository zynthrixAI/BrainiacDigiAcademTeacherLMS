"use client";

import { useMutation } from "@tanstack/react-query";
import { previewClasses } from "@/lib/api/liveClasses";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import type {
  ClassPreviewPayload,
  ClassPreviewResponse,
} from "@/types/liveClass";

/**
 * Dry-run a recurrence into slots. batchId travels in the variables (not a
 * closure) so a single instance works across the global page's batch selector.
 */
export function usePreviewClasses() {
  const cookies = useCookies();

  return useMutation<
    ClassPreviewResponse,
    Error,
    { batchId: string; payload: ClassPreviewPayload }
  >({
    mutationFn: ({ batchId, payload }) =>
      withAuthToken(cookies, (token) =>
        previewClasses(token, batchId, payload),
      ),
  });
}
