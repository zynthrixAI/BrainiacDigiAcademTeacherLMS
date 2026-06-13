"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "@/hooks/useCookies";
import { clearAuthTokens } from "@/lib/utils/authCookies";

export function useTeacherLogout() {
  const queryClient = useQueryClient();
  const { deleteCookie } = useCookies();

  return useMutation<void, Error, void>({
    mutationFn: () => clearAuthTokens(deleteCookie),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
