"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { UserIcon } from "@/components/icons/UserIcon";
import { LockIcon } from "@/components/icons/LockIcon";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { useTeacherLogin } from "@/hooks/mutations/useTeacherLogin";
import { ROUTES } from "@/lib/constants";
import type { TeacherLoginPayload } from "@/types/auth";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const initialValues: TeacherLoginPayload = {
  email: "",
  password: "",
};

export function TeacherLoginForm() {
  const router = useRouter();
  const { mutateAsync, isPending, isError, error } = useTeacherLogin();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        try {
          await mutateAsync(values);
          router.push(ROUTES.dashboard);
        } catch {
          // Surfaced to the user via the `isError` banner below.
        }
      }}
    >
      <Form className="mt-7 flex flex-col gap-4" noValidate>
        <InputField
          name="email"
          label="Email"
          type="email"
          placeholder="you@bda.edu.pk"
          autoComplete="email"
          icon={<UserIcon size={16} />}
        />

        <InputField
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          icon={<LockIcon size={16} />}
          labelAccessory={
            <Link
              href={ROUTES.forgotPassword}
              className="text-xs font-bold text-yellow-ink hover:underline"
            >
              Forgot?
            </Link>
          }
        />

        {isError ? (
          <div
            role="alert"
            className="rounded-[10px] border border-[#f5b5b5] bg-[#fef2f2] p-3 text-xs font-semibold text-red"
          >
            {error?.message ??
              "We couldn't sign you in. Please check your details and try again."}
          </div>
        ) : null}

        <Button type="submit" isLoading={isPending} className="w-full">
          {isPending ? "Signing in…" : "Sign in to portal"}
          {!isPending ? <ArrowRightIcon size={14} /> : null}
        </Button>
      </Form>
    </Formik>
  );
}
