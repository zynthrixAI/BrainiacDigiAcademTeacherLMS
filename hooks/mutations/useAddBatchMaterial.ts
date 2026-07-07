"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBatchMaterial } from "@/lib/api/resources";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { ResourceItem } from "@/types/resource";

export function useAddBatchMaterial(batchId: string) {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<ResourceItem, Error, FormData>({
    mutationFn: (formData) =>
      withAuthToken(cookies, (token) =>
        addBatchMaterial(token, batchId, formData),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.batches.materials(batchId),
      });
    },
  });
}
