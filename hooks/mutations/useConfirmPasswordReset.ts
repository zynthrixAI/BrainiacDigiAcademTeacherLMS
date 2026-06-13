"use client";

import { useMutation } from "@tanstack/react-query";
import { confirmTeacherPasswordReset } from "@/lib/api/auth";
import { useCookies } from "@/hooks/useCookies";
import { clearAuthTokens } from "@/lib/utils/authCookies";
import { extractAuthError } from "@/lib/utils/authError";
import type { ConfirmResetPayload } from "@/types/auth";

export function useConfirmPasswordReset() {
  const { deleteCookie } = useCookies();

  return useMutation<void, Error, ConfirmResetPayload>({
    mutationFn: async (payload) => {
      try {
        await confirmTeacherPasswordReset(payload);
        // The backend invalidates any existing session on reset — drop cookies.
        await clearAuthTokens(deleteCookie);
      } catch (error) {
        throw new Error(extractAuthError(error));
      }
    },
  });
}
