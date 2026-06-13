"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRecording } from "@/lib/api/recordings";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { Recording, RecordingUpdatePayload } from "@/types/recording";

interface UpdateRecordingVariables {
  id: string;
  payload: RecordingUpdatePayload;
}

export function useUpdateRecording() {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<Recording, Error, UpdateRecordingVariables>({
    mutationFn: ({ id, payload }) =>
      withAuthToken(cookies, (token) => updateRecording(token, id, payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recordings.root });
    },
  });
}
