"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { releaseGrade } from "@/lib/api/submissions";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { Submission } from "@/types/submission";

export function useReleaseGrade() {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<Submission, Error, string>({
    mutationFn: (submissionId) =>
      withAuthToken(cookies, (token) => releaseGrade(token, submissionId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.submissions.root });
    },
  });
}
