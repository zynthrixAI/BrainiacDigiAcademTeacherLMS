"use client";

import { useQuery } from "@tanstack/react-query";
import { listAssignments } from "@/lib/api/assignments";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { Assignment } from "@/types/assignment";

export function useAssignments(batchId: string) {
  const cookies = useCookies();

  return useQuery<Assignment[]>({
    queryKey: QUERY_KEYS.assignments.list(batchId),
    queryFn: () =>
      withAuthToken(cookies, (token) => listAssignments(token, batchId)),
    enabled: Boolean(batchId),
    retry: false,
  });
}
