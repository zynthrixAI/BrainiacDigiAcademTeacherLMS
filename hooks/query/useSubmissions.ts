"use client";

import { useQuery } from "@tanstack/react-query";
import { listSubmissions } from "@/lib/api/submissions";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { Submission } from "@/types/submission";

export function useSubmissions(assignmentId: string) {
  const cookies = useCookies();

  return useQuery<Submission[]>({
    queryKey: QUERY_KEYS.submissions.list(assignmentId),
    queryFn: () =>
      withAuthToken(cookies, (token) =>
        listSubmissions(token, assignmentId),
      ),
    enabled: Boolean(assignmentId),
    retry: false,
  });
}
