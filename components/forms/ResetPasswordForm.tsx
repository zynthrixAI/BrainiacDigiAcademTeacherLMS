"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { LockIcon } from "@/components/icons/LockIcon";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { useConfirmPasswordReset } from "@/hooks/mutations/useConfirmPasswordReset";
import type { ResetPasswordFormValues } from "@/types/auth";

const validationSchema = Yup.object({
  new_password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("new_password")], "Passwords must match")
    .required("Please confirm your password"),
});

const initialValues: ResetPasswordFormValues = {
  new_password: "",
  confirm_password: "",
};

interface ResetPasswordFormProps {
  resetToken: string;
  onReset: () => void;
}

export function ResetPasswordForm({
  resetToken,
  onReset,
}: ResetPasswordFormProps) {
  const { mutateAsync, isPending, isError, error } = useConfirmPasswordReset();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        try {
          await mutateAsync({
            reset_token: resetToken,
            new_password: values.new_password,
          });
          onReset();
        } catch {
          // Surfaced via the FormError banner below.
        }
      }}
    >
      <Form className="mt-7 flex flex-col gap-4" noValidate>
        <InputField
          name="new_password"
          label="New password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          icon={<LockIcon size={16} />}
        />

        <InputField
          name="confirm_password"
          label="Confirm password"
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          icon={<LockIcon size={16} />}
        />

        <FormError message={isError ? error?.message : undefined} />

        <Button type="submit" isLoading={isPending} className="w-full">
          {isPending ? "Resetting…" : "Reset password"}
          {!isPending ? <CheckIcon size={14} /> : null}
        </Button>
      </Form>
    </Formik>
  );
}
