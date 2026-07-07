"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addRecordingResource } from "@/lib/api/resources";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { ResourceItem } from "@/types/resource";

export function useAddRecordingResource(recordingId: string) {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<ResourceItem, Error, FormData>({
    mutationFn: (formData) =>
      withAuthToken(cookies, (token) =>
        addRecordingResource(token, recordingId, formData),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recordings.root });
    },
  });
}
