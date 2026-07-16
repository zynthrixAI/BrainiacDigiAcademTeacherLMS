"use client";

import { useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import type {
  LiveClassCreatePayload,
  LiveClassFormValues,
} from "@/types/liveClass";

function buildValidationSchema(zoomConnected: boolean) {
  const meetingUrl = Yup.string().url("Enter a valid URL");
  return Yup.object({
    title: Yup.string()
      .min(3, "Title is too short")
      .required("Title is required"),
    scheduled_at: Yup.string().required("Pick a date and time"),
    total_duration: Yup.number()
      .typeError("Enter the duration in minutes")
      .min(5, "At least 5 minutes")
      .required("Duration is required"),
    // With Zoom connected the backend creates the meeting automatically, so
    // the URL becomes optional; without it, a manual link is still required.
    meeting_url: zoomConnected
      ? meetingUrl
      : meetingUrl.required("Meeting URL is required"),
    host_url: Yup.string().url("Enter a valid URL"),
    meeting_id: Yup.string(),
  });
}

interface LiveClassFormProps {
  initialValues: LiveClassFormValues;
  submitLabel: string;
  pending: boolean;
  errorMessage?: string;
  disabled?: boolean;
  /** Whether the teacher has a connected Zoom account (auto-created meetings). */
  zoomConnected?: boolean;
  onSubmit: (payload: LiveClassCreatePayload) => Promise<void>;
}

export function LiveClassForm({
  initialValues,
  submitLabel,
  pending,
  errorMessage,
  disabled = false,
  zoomConnected = false,
  onSubmit,
}: LiveClassFormProps) {
  const validationSchema = useMemo(
    () => buildValidationSchema(zoomConnected),
    [zoomConnected],
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        try {
          const meetingUrl = values.meeting_url.trim();
          await onSubmit({
            title: values.title.trim(),
            total_duration: Number(values.total_duration),
            // Omit (not null/empty) when blank so the backend knows to
            // auto-create the Zoom meeting.
            ...(meetingUrl ? { meeting_url: meetingUrl } : {}),
            host_url: values.host_url.trim() || undefined,
            meeting_id: values.meeting_id.trim() || undefined,
            scheduled_at: new Date(values.scheduled_at).toISOString(),
          });
        } catch {
          // Surfaced via the errorMessage banner below.
        }
      }}
    >
      {({ values }) => (
        <Form className="flex flex-col gap-4" noValidate>
          <InputField
            name="title"
            label="Title"
            placeholder="e.g. Organic Chemistry — Aldol Reactions"
          />
          <InputField
            name="scheduled_at"
            label="Scheduled for"
            type="datetime-local"
          />
          <InputField
            name="total_duration"
            label="Duration (minutes)"
            type="number"
            inputMode="numeric"
            placeholder="60"
          />
          <div className="flex flex-col gap-1.5">
            <InputField
              name="meeting_url"
              label={`Meeting URL (${
                zoomConnected ? "optional — " : ""
              }students join here)`}
              placeholder="https://zoom.us/j/..."
            />
            {zoomConnected && values.meeting_url.trim() === "" ? (
              <span className="text-xs text-muted">
                Leave empty — a Zoom meeting will be created automatically ~15
                minutes before start
              </span>
            ) : null}
          </div>
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
      )}
    </Formik>
  );
}
