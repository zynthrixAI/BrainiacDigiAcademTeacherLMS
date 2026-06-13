"use client";

import { useMutation } from "@tanstack/react-query";
import { verifyTeacherResetOtp } from "@/lib/api/auth";
import { extractAuthError } from "@/lib/utils/authError";
import type { VerifyOtpPayload } from "@/types/auth";

export function useVerifyResetOtp() {
  return useMutation<string, Error, VerifyOtpPayload>({
    mutationFn: async (payload) => {
      try {
        const { reset_token } = await verifyTeacherResetOtp(payload);
        return reset_token;
      } catch (error) {
        throw new Error(extractAuthError(error));
      }
    },
  });
}
