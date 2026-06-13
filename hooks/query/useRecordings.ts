"use client";

import { useQuery } from "@tanstack/react-query";
import { listRecordings } from "@/lib/api/recordings";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { Recording } from "@/types/recording";

export function useRecordings() {
  const cookies = useCookies();

  return useQuery<Recording[]>({
    queryKey: QUERY_KEYS.recordings.list,
    queryFn: () => withAuthToken(cookies, (token) => listRecordings(token)),
    retry: false,
  });
}
