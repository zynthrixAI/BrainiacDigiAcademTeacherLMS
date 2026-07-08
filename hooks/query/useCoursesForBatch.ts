"use client";

import { useQuery } from "@tanstack/react-query";
import { listCoursesForBatch } from "@/lib/api/courses";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { CourseOption } from "@/types/course";

/**
 * Lists the published courses a batch can be linked to (its subject's
 * courses). Pass `enabled: false` while the picker is closed to avoid
 * fetching before it's needed.
 */
export function useCoursesForBatch(batchId: string, enabled = true) {
  const cookies = useCookies();

  return useQuery<CourseOption[]>({
    queryKey: QUERY_KEYS.courses.forBatch(batchId),
    queryFn: async () => {
      const { items } = await withAuthToken(cookies, (token) =>
        listCoursesForBatch(token, batchId),
      );
      return items;
    },
    enabled,
    retry: false,
  });
}
