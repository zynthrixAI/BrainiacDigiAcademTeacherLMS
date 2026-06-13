"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAssignment } from "@/lib/api/assignments";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { Assignment } from "@/types/assignment";

interface UpdateAssignmentVariables {
  id: string;
  formData: FormData;
}

export function useUpdateAssignment() {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<Assignment, Error, UpdateAssignmentVariables>({
    mutationFn: ({ id, formData }) =>
      withAuthToken(cookies, (token) => updateAssignment(token, id, formData)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assignments.root });
    },
  });
}
