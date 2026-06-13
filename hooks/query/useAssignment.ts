"use client";

import { useQuery } from "@tanstack/react-query";
import { getAssignment } from "@/lib/api/assignments";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { Assignment } from "@/types/assignment";

export function useAssignment(assignmentId: string) {
  const cookies = useCookies();

  return useQuery<Assignment>({
    queryKey: QUERY_KEYS.assignments.detail(assignmentId),
    queryFn: () =>
      withAuthToken(cookies, (token) => getAssignment(token, assignmentId)),
    enabled: Boolean(assignmentId),
    retry: false,
  });
}
