"use client";

import { useQuery } from "@tanstack/react-query";
import { listCoursesBySubject } from "@/lib/api/courses";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { CourseOption } from "@/types/course";

/**
 * Lists courses for a subject so a teacher can link one to a batch.
 *
 * STUB: there is no teacher-facing "list courses by subject" endpoint on the
 * backend yet (see `lib/api/courses.ts`), so this query is disabled — it
 * never fires a doomed network request and just renders as an empty,
 * non-loading list. Once the backend adds a teacher route, implement
 * `listCoursesBySubject` for real and delete the `enabled: false` line below;
 * no call site changes are needed.
 */
export function useCoursesBySubject(subjectId: string | undefined) {
  const cookies = useCookies();

  return useQuery<CourseOption[]>({
    queryKey: QUERY_KEYS.courses.bySubject(subjectId ?? ""),
    queryFn: () =>
      withAuthToken(cookies, (token) =>
        listCoursesBySubject(token, subjectId as string),
      ),
    enabled: false,
    retry: false,
    initialData: [] as CourseOption[],
  });
}
