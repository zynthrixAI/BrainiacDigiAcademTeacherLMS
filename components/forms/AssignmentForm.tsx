"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { RubricBuilder } from "@/components/forms/RubricBuilder";
import type {
  AssignmentFormValues,
  RubricCriterion,
  RubricFormRow,
} from "@/types/assignment";

const validationSchema = Yup.object({
  title: Yup.string().min(3, "Title is too short").required("Title is required"),
  instructions: Yup.string().required("Instructions are required"),
  deadline: Yup.string().required("Pick a deadline"),
});

/** Requires at least one rubric criterion, each with a name and max_marks >= 1. */
const rubricSchema = Yup.array()
  .of(
    Yup.object({
      criterion: Yup.string().trim().required("Criterion name is required"),
      max_marks: Yup.number()
        .typeError("Enter a valid number")
        .min(1, "Max marks must be at least 1")
        .required("Max marks is required"),
    }),
  )
  .min(1, "Add at least one rubric criterion with a name and marks.");

/** Runs the rubric rows (after dropping blank-named ones) through `rubricSchema`. */
function getRubricError(rows: RubricFormRow[]): string | undefined {
  const cleaned = rows
    .filter((row) => row.criterion.trim() !== "")
    .map((row) => ({
      criterion: row.criterion.trim(),
      max_marks: Number(row.max_marks),
    }));
  try {
    rubricSchema.validateSync(cleaned, { abortEarly: false });
    return undefined;
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      return err.errors[0] ?? "Fix the rubric before saving.";
    }
    return "Fix the rubric before saving.";
  }
}

const LABEL = "font-display text-[12.5px] font-bold text-ink-2";
const FIELD =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow placeholder:text-muted-2";

interface AssignmentFormProps {
  initialValues: AssignmentFormValues;
  initialRubric: RubricCriterion[];
  initialFileUrl?: string | null;
  showStatus: boolean;
  submitLabel: string;
  pending: boolean;
  errorMessage?: string;
  disabled?: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function AssignmentForm({
  initialValues,
  initialRubric,
  initialFileUrl,
  showStatus,
  submitLabel,
  pending,
  errorMessage,
  disabled = false,
  onSubmit,
}: AssignmentFormProps) {
  const [rubric, setRubric] = useState<RubricFormRow[]>(
    initialRubric.length > 0
      ? initialRubric.map((item) => ({
          criterion: item.criterion,
          max_marks: String(item.max_marks),
        }))
      : [{ criterion: "", max_marks: "10" }],
  );
  const [file, setFile] = useState<File | null>(null);

  const rubricError = getRubricError(rubric);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        // Defense-in-depth: the Save button is already disabled while
        // `rubricError` is set, but guard here too in case that state is
        // stale (e.g. a submit triggered before a re-render flushes).
        if (rubricError) return;

        const formData = new FormData();
        formData.append("title", values.title.trim());
        formData.append("instructions", values.instructions.trim());
        formData.append("deadline", new Date(values.deadline).toISOString());
        formData.append(
          "allow_resubmission",
          String(values.allow_resubmission),
        );
        formData.append(
          "rubric",
          JSON.stringify(
            rubric
              .filter((row) => row.criterion.trim() !== "")
              .map((row) => ({
                criterion: row.criterion.trim(),
                max_marks: Number(row.max_marks) || 0,
              })),
          ),
        );
        if (showStatus) formData.append("status", values.status);
        if (file) formData.append("file", file);

        try {
          await onSubmit(formData);
        } catch {
          // Surfaced via the errorMessage banner below.
        }
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
        <Form className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className={LABEL}>
              Title
            </label>
            <input
              id="title"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Titration Lab Report"
              className={FIELD}
            />
            {touched.title && errors.title ? (
              <span className="text-xs text-red">{errors.title}</span>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="instructions" className={LABEL}>
              Instructions
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={values.instructions}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={3}
              placeholder="What students need to do"
              className={`${FIELD} resize-none`}
            />
            {touched.instructions && errors.instructions ? (
              <span className="text-xs text-red">{errors.instructions}</span>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="deadline" className={LABEL}>
              Deadline
            </label>
            <input
              id="deadline"
              name="deadline"
              type="datetime-local"
              value={values.deadline}
              onChange={handleChange}
              onBlur={handleBlur}
              className={FIELD}
            />
            {touched.deadline && errors.deadline ? (
              <span className="text-xs text-red">{errors.deadline}</span>
            ) : null}
          </div>

          <RubricBuilder rows={rubric} onChange={setRubric} />
          {rubricError ? (
            <span role="alert" className="text-xs text-red">
              {rubricError}
            </span>
          ) : null}

          <label className="flex items-center gap-2 text-sm text-ink-2">
            <input
              type="checkbox"
              name="allow_resubmission"
              checked={values.allow_resubmission}
              onChange={(event) =>
                setFieldValue("allow_resubmission", event.target.checked)
              }
            />
            Allow resubmission
          </label>

          {showStatus ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="status" className={LABEL}>
                Status
              </label>
              <select
                id="status"
                name="status"
                value={values.status}
                onChange={handleChange}
                className={FIELD}
              >
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <label htmlFor="file" className={LABEL}>
              Attachment (optional)
            </label>
            <input
              id="file"
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-[#f5f5f4] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-ink"
            />
            {!file && initialFileUrl ? (
              <a
                href={initialFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-yellow-ink hover:underline"
              >
                Current attachment ↗
              </a>
            ) : null}
          </div>

          <FormError message={errorMessage} />

          <Button
            type="submit"
            isLoading={pending}
            disabled={disabled || Boolean(rubricError)}
            className="w-full"
          >
            {pending ? "Saving…" : submitLabel}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
