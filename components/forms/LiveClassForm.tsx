"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import type {
  LiveClassCreatePayload,
  LiveClassFormValues,
} from "@/types/liveClass";

const validationSchema = Yup.object({
  title: Yup.string().min(3, "Title is too short").required("Title is required"),
  scheduled_at: Yup.string().required("Pick a date and time"),
  total_duration: Yup.number()
    .typeError("Enter the duration in minutes")
    .min(5, "At least 5 minutes")
    .required("Duration is required"),
  meeting_url: Yup.string()
    .url("Enter a valid URL")
    .required("Meeting URL is required"),
  host_url: Yup.string().url("Enter a valid URL"),
  meeting_id: Yup.string(),
});

interface LiveClassFormProps {
  initialValues: LiveClassFormValues;
  submitLabel: string;
  pending: boolean;
  errorMessage?: string;
  disabled?: boolean;
  onSubmit: (payload: LiveClassCreatePayload) => Promise<void>;
}

export function LiveClassForm({
  initialValues,
  submitLabel,
  pending,
  errorMessage,
  disabled = false,
  onSubmit,
}: LiveClassFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        try {
          await onSubmit({
            title: values.title.trim(),
            total_duration: Number(values.total_duration),
            meeting_url: values.meeting_url.trim(),
            host_url: values.host_url.trim() || undefined,
            meeting_id: values.meeting_id.trim() || undefined,
            scheduled_at: new Date(values.scheduled_at).toISOString(),
          });
        } catch {
          // Surfaced via the errorMessage banner below.
        }
      }}
    >
      <Form className="flex flex-col gap-4" noValidate>
        <InputField
          name="title"
          label="Title"
          placeholder="e.g. Organic Chemistry — Aldol Reactions"
        />
        <InputField name="scheduled_at" label="Scheduled for" type="datetime-local" />
        <InputField
          name="total_duration"
          label="Duration (minutes)"
          type="number"
          inputMode="numeric"
          placeholder="60"
        />
        <InputField
          name="meeting_url"
          label="Meeting URL (students join here)"
          placeholder="https://zoom.us/j/..."
        />
        <InputField
          name="host_url"
          label="Host URL (optional, teacher only)"
          placeholder="https://zoom.us/s/..."
        />
        <InputField
          name="meeting_id"
          label="Meeting ID (optional)"
          placeholder="123 4567 8900"
        />

        <FormError message={errorMessage} />

        <Button
          type="submit"
          isLoading={pending}
          disabled={disabled}
          className="w-full"
        >
          {pending ? "Saving…" : submitLabel}
        </Button>
      </Form>
    </Formik>
  );
}
