"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endLiveClass } from "@/lib/api/liveClasses";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { AttendanceListResponse } from "@/types/attendance";

export function useEndLiveClass() {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<AttendanceListResponse, Error, string>({
    mutationFn: (liveClassId) =>
      withAuthToken(cookies, (token) => endLiveClass(token, liveClassId)),
    onSuccess: (_data, liveClassId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.liveClasses.root });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.liveClasses.attendance(liveClassId),
      });
    },
  });
}
