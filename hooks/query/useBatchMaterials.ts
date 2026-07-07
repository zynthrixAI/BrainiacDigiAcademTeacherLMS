"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { ResourceItem } from "@/types/resource";

/**
 * The teacher API only exposes add/delete for batch materials — there is no
 * GET endpoint yet to list them (unlike recordings, whose GET response embeds
 * `resources`). This query seeds an empty list and the add/delete mutations
 * patch the cache directly via `setQueryData`, so materials stay visible for
 * as long as this query stays cached. A hard refresh (or cache eviction)
 * loses the list until the backend grows a list endpoint.
 */
export function useBatchMaterials(batchId: string) {
  return useQuery<ResourceItem[]>({
    queryKey: QUERY_KEYS.batches.materials(batchId),
    queryFn: () => Promise.resolve<ResourceItem[]>([]),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
