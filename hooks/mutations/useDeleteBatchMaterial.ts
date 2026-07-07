"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBatchMaterial } from "@/lib/api/resources";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { ResourceItem } from "@/types/resource";

/** See `useAddBatchMaterial` for why this patches the cache instead of invalidating. */
export function useDeleteBatchMaterial(batchId: string) {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (resourceId) =>
      withAuthToken(cookies, (token) =>
        deleteBatchMaterial(token, batchId, resourceId),
      ),
    onSuccess: (_data, resourceId) => {
      queryClient.setQueryData<ResourceItem[]>(
        QUERY_KEYS.batches.materials(batchId),
        (existing) => (existing ?? []).filter((item) => item.id !== resourceId),
      );
    },
  });
}
