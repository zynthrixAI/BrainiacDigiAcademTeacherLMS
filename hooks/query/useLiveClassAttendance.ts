"use client";

import { useQuery } from "@tanstack/react-query";
import { getLiveClassAttendance } from "@/lib/api/liveClasses";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { AttendanceListResponse } from "@/types/attendance";

export function useLiveClassAttendance(liveClassId: string, enabled: boolean) {
  const cookies = useCookies();

  return useQuery<AttendanceListResponse>({
    queryKey: QUERY_KEYS.liveClasses.attendance(liveClassId),
    queryFn: () =>
      withAuthToken(cookies, (token) =>
        getLiveClassAttendance(token, liveClassId),
      ),
    enabled: enabled && Boolean(liveClassId),
    retry: false,
  });
}
