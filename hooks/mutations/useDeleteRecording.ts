"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRecording } from "@/lib/api/recordings";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";

export function useDeleteRecording() {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (recordingId) =>
      withAuthToken(cookies, (token) => deleteRecording(token, recordingId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recordings.root });
    },
  });
}
