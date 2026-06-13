"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gradeSubmission } from "@/lib/api/submissions";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { GradeRequest, Submission } from "@/types/submission";

interface GradeSubmissionVariables {
  submissionId: string;
  body: GradeRequest;
}

export function useGradeSubmission() {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<Submission, Error, GradeSubmissionVariables>({
    mutationFn: ({ submissionId, body }) =>
      withAuthToken(cookies, (token) =>
        gradeSubmission(token, submissionId, body),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.submissions.root });
    },
  });
}
