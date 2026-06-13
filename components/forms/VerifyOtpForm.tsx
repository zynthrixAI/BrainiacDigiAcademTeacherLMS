"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { LockIcon } from "@/components/icons/LockIcon";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { useVerifyResetOtp } from "@/hooks/mutations/useVerifyResetOtp";
import { useRequestPasswordReset } from "@/hooks/mutations/useRequestPasswordReset";
import type { VerifyOtpFormValues } from "@/types/auth";

const validationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{6}$/, "Enter the 6-digit code")
    .required("Code is required"),
});

const initialValues: VerifyOtpFormValues = { otp: "" };

interface VerifyOtpFormProps {
  email: string;
  onVerified: (resetToken: string) => void;
}

export function VerifyOtpForm({ email, onVerified }: VerifyOtpFormProps) {
  const { mutateAsync, isPending, isError, error } = useVerifyResetOtp();
  const resend = useRequestPasswordReset();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        try {
          const resetToken = await mutateAsync({ email, otp: values.otp });
          onVerified(resetToken);
        } catch {
          // Surfaced via the FormError banner below.
        }
      }}
    >
      <Form className="mt-7 flex flex-col gap-4" noValidate>
        <InputField
          name="otp"
          label="6-digit code"
          inputMode="numeric"
          maxLength={6}
          placeholder="••••••"
          autoComplete="one-time-code"
          icon={<LockIcon size={16} />}
        />

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">
            {resend.isSuccess ? "A new code is on its way." : `Sent to ${email}`}
          </span>
          <button
            type="button"
            onClick={() => resend.mutate({ email })}
            disabled={resend.isPending}
            className="font-bold text-yellow-ink hover:underline disabled:opacity-60"
          >
            {resend.isPending ? "Resending…" : "Resend code"}
          </button>
        </div>

        <FormError message={isError ? error?.message : undefined} />

        <Button type="submit" isLoading={isPending} className="w-full">
          {isPending ? "Verifying…" : "Verify code"}
          {!isPending ? <ArrowRightIcon size={14} /> : null}
        </Button>
      </Form>
    </Formik>
  );
}
