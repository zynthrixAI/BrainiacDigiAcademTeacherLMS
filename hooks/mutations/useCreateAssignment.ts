"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAssignment } from "@/lib/api/assignments";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { Assignment } from "@/types/assignment";

export function useCreateAssignment(batchId: string) {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<Assignment, Error, FormData>({
    mutationFn: (formData) =>
      withAuthToken(cookies, (token) =>
        createAssignment(token, batchId, formData),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assignments.root });
    },
  });
}
