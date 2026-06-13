"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import type {
  RecordingCreatePayload,
  RecordingFormValues,
  RecordingStatus,
} from "@/types/recording";

const STATUS_OPTIONS: { value: RecordingStatus; label: string }[] = [
  { value: "processing", label: "Processing" },
  { value: "draft", label: "Draft" },
  { value: "pending_edit", label: "Pending edit" },
  { value: "published", label: "Published" },
];

const validationSchema = Yup.object({
  title: Yup.string().min(3, "Title is too short").required("Title is required"),
  link: Yup.string().url("Enter a valid URL").required("Recording link is required"),
  description: Yup.string(),
});

interface RecordingFormProps {
  initialValues: RecordingFormValues;
  submitLabel: string;
  pending: boolean;
  errorMessage?: string;
  disabled?: boolean;
  onSubmit: (payload: RecordingCreatePayload) => Promise<void>;
}

export function RecordingForm({
  initialValues,
  submitLabel,
  pending,
  errorMessage,
  disabled = false,
  onSubmit,
}: RecordingFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        try {
          await onSubmit({
            title: values.title.trim(),
            description: values.description.trim(),
            link: values.link.trim(),
            status: values.status,
          });
        } catch {
          // Surfaced via the errorMessage banner below.
        }
      }}
    >
      {({ values, handleChange }) => (
        <Form className="flex flex-col gap-4" noValidate>
          <InputField
            name="title"
            label="Title"
            placeholder="e.g. Aldol Reactions — full walkthrough"
          />
          <InputField
            name="link"
            label="Recording link (HLS / CDN URL)"
            placeholder="https://..."
          />
          <InputField
            name="description"
            label="Description (optional)"
            placeholder="What this recording covers"
          />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="status"
              className="font-display text-[12.5px] font-bold text-ink-2"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={values.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

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
