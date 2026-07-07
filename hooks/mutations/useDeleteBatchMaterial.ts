"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBatchMaterial } from "@/lib/api/resources";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";

export function useDeleteBatchMaterial(batchId: string) {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (resourceId) =>
      withAuthToken(cookies, (token) =>
        deleteBatchMaterial(token, batchId, resourceId),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.batches.materials(batchId),
      });
    },
  });
}
