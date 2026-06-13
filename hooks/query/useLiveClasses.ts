"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listLiveClasses } from "@/lib/api/liveClasses";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { PaginatedResponse } from "@/types/api";
import type { LiveClass, LiveClassListParams } from "@/types/liveClass";

export function useLiveClasses(batchId: string, params: LiveClassListParams) {
  const cookies = useCookies();

  return useQuery<PaginatedResponse<LiveClass>>({
    queryKey: QUERY_KEYS.liveClasses.list(batchId, params),
    queryFn: () =>
      withAuthToken(cookies, (token) =>
        listLiveClasses(token, batchId, params),
      ),
    enabled: Boolean(batchId),
    placeholderData: keepPreviousData,
    retry: false,
  });
}
