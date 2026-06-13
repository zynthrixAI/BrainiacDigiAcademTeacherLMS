"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginTeacher } from "@/lib/api/auth";
import { useCookies } from "@/hooks/useCookies";
import { persistAuthTokens } from "@/lib/utils/authCookies";
import { extractAuthError } from "@/lib/utils/authError";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { TeacherLoginPayload } from "@/types/auth";

export function useTeacherLogin() {
  const queryClient = useQueryClient();
  const { setCookie } = useCookies();

  return useMutation<void, Error, TeacherLoginPayload>({
    mutationFn: async (payload) => {
      try {
        const tokens = await loginTeacher(payload);
        await persistAuthTokens(setCookie, tokens);
      } catch (error) {
        throw new Error(extractAuthError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.session });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.auth.currentTeacher,
      });
    },
  });
}
