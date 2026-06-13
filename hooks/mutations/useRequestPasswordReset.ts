"use client";

import { useMutation } from "@tanstack/react-query";
import { requestTeacherPasswordReset } from "@/lib/api/auth";
import { extractAuthError } from "@/lib/utils/authError";
import type { RequestPasswordResetPayload } from "@/types/auth";

export function useRequestPasswordReset() {
  return useMutation<void, Error, RequestPasswordResetPayload>({
    mutationFn: async (payload) => {
      try {
        await requestTeacherPasswordReset(payload);
      } catch (error) {
        throw new Error(extractAuthError(error));
      }
    },
  });
}
