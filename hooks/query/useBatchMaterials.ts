"use client";

import { useQuery } from "@tanstack/react-query";
import { listBatchMaterials } from "@/lib/api/resources";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { ResourceItem } from "@/types/resource";

export function useBatchMaterials(batchId: string) {
  const cookies = useCookies();

  return useQuery<ResourceItem[]>({
    queryKey: QUERY_KEYS.batches.materials(batchId),
    queryFn: () =>
      withAuthToken(cookies, (token) => listBatchMaterials(token, batchId)),
    retry: false,
  });
}
