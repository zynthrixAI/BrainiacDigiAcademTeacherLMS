"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRecordingResource } from "@/lib/api/resources";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";

interface DeleteRecordingResourceVariables {
  recordingId: string;
  resourceId: string;
}

export function useDeleteRecordingResource() {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteRecordingResourceVariables>({
    mutationFn: ({ recordingId, resourceId }) =>
      withAuthToken(cookies, (token) =>
        deleteRecordingResource(token, recordingId, resourceId),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recordings.root });
    },
  });
}
