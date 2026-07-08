"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { MailIcon } from "@/components/icons/MailIcon";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { useRequestPasswordReset } from "@/hooks/mutations/useRequestPasswordReset";
import type { RequestPasswordResetPayload } from "@/types/auth";

const validationSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
});

interface RequestResetFormProps {
  defaultEmail?: string;
  onSent: (email: string) => void;
}

export function RequestResetForm({
  defaultEmail = "",
  onSent,
}: RequestResetFormProps) {
  const { mutateAsync, isPending, isError, error } = useRequestPasswordReset();
  const initialValues: RequestPasswordResetPayload = { email: defaultEmail };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        try {
          await mutateAsync(values);
          onSent(values.email);
        } catch {
          // Surfaced via the FormError banner below.
        }
      }}
    >
      <Form className="mt-7 flex flex-col gap-4" noValidate>
        <InputField
          name="email"
          label="Email"
          type="email"
          placeholder="you@brainiacs.edu.pk"
          autoComplete="email"
          icon={<MailIcon size={16} />}
        />

        <FormError message={isError ? error?.message : undefined} />

        <Button type="submit" isLoading={isPending} className="w-full">
          {isPending ? "Sending code…" : "Send reset code"}
          {!isPending ? <ArrowRightIcon size={14} /> : null}
        </Button>
      </Form>
    </Formik>
  );
}
