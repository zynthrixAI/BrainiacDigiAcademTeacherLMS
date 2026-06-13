"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecording } from "@/lib/api/recordings";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { Recording, RecordingCreatePayload } from "@/types/recording";

export function useCreateRecording(liveClassId: string) {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<Recording, Error, RecordingCreatePayload>({
    mutationFn: (payload) =>
      withAuthToken(cookies, (token) =>
        createRecording(token, liveClassId, payload),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recordings.root });
    },
  });
}
