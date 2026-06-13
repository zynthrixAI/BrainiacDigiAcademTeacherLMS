"use client";

import { useQuery } from "@tanstack/react-query";
import { getTeacherProfile } from "@/lib/api/auth";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { TeacherProfile } from "@/types/auth";

export function useTeacherProfile() {
  const cookies = useCookies();

  return useQuery<TeacherProfile>({
    queryKey: QUERY_KEYS.auth.currentTeacher,
    queryFn: () => withAuthToken(cookies, (token) => getTeacherProfile(token)),
    retry: false,
  });
}
