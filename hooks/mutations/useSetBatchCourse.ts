"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setBatchCourse } from "@/lib/api/batches";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { Batch } from "@/types/batch";

interface SetBatchCourseVariables {
  batchId: string;
  courseId: string | null;
}

export function useSetBatchCourse() {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<Batch, Error, SetBatchCourseVariables>({
    mutationFn: ({ batchId, courseId }) =>
      withAuthToken(cookies, (token) => setBatchCourse(token, batchId, courseId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.batches.all });
    },
  });
}
