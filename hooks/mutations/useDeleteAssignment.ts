"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAssignment } from "@/lib/api/assignments";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";

export function useDeleteAssignment() {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (assignmentId) =>
      withAuthToken(cookies, (token) => deleteAssignment(token, assignmentId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assignments.root });
    },
  });
}
