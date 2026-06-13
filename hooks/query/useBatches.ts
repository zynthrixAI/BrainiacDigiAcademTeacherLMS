"use client";

import { useQuery } from "@tanstack/react-query";
import { getBatches } from "@/lib/api/batches";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { Batch } from "@/types/batch";

export function useBatches() {
  const cookies = useCookies();

  return useQuery<Batch[]>({
    queryKey: QUERY_KEYS.batches.all,
    queryFn: () => withAuthToken(cookies, (token) => getBatches(token)),
    retry: false,
  });
}
