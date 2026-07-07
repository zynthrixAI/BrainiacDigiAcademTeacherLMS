"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { PlusIcon } from "@/components/icons/PlusIcon";
import type { ResourceFormValues, ResourceItem, ResourceKind } from "@/types/resource";

export const RESOURCE_KIND_OPTIONS: { value: ResourceKind; label: string }[] = [
  { value: "past_paper", label: "Past paper" },
  { value: "mark_scheme", label: "Mark scheme" },
  { value: "class_notes", label: "Class notes" },
  { value: "worksheet", label: "Worksheet" },
  { value: "formula_sheet", label: "Formula sheet" },
  { value: "slides", label: "Slides" },
  { value: "other", label: "Other" },
];

const KIND_LABELS: Record<ResourceKind, string> = RESOURCE_KIND_OPTIONS.reduce(
  (acc, option) => ({ ...acc, [option.value]: option.label }),
  {} as Record<ResourceKind, string>,
);

const EMPTY_FORM: ResourceFormValues = { title: "", kind: "other" };

const validationSchema = Yup.object({
  title: Yup.string().min(2, "Title is too short").required("Title is required"),
  kind: Yup.string().required(),
});

const LABEL = "font-display text-[12.5px] font-bold text-ink-2";
const FIELD =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow placeholder:text-muted-2";

interface ResourceManagerProps {
  resources: ResourceItem[];
  isLoading?: boolean;
  listErrorMessage?: string;
  addPending: boolean;
  addErrorMessage?: string;
  deletingId?: string | null;
  onAdd: (formData: FormData) => Promise<void>;
  onDelete: (resource: ResourceItem) => void;
  emptyLabel?: string;
}

/**
 * Shared list + upload manager for downloadable resources — used for both a
 * single recording's resources and a batch's materials. Callers own the data
 * source (query) and the add/delete mutations; this component only renders
 * the UI and builds the multipart form.
 */
export function ResourceManager({
  resources,
  isLoading = false,
  listErrorMessage,
  addPending,
  addErrorMessage,
  deletingId = null,
  onAdd,
  onDelete,
  emptyLabel = "No resources yet.",
}: ResourceManagerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | undefined>(undefined);

  return (
    <div className="flex flex-col gap-5">
      <Formik
        initialValues={EMPTY_FORM}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          if (!file) {
            setFileError("Choose a file to upload");
            return;
          }
          setFileError(undefined);

          const formData = new FormData();
          formData.append("title", values.title.trim());
          formData.append("kind", values.kind);
          formData.append("file", file);

          try {
            await onAdd(formData);
            resetForm();
            setFile(null);
          } catch {
            // Surfaced via addErrorMessage below.
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form className="flex flex-col gap-3 rounded-[14px] border border-line bg-white p-4" noValidate>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="resource-title" className={LABEL}>
                  Title
                </label>
                <input
                  id="resource-title"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. 2024 Past Paper — Paper 1"
                  className={FIELD}
                />
                {touched.title && errors.title ? (
                  <span className="text-xs text-red">{errors.title}</span>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="resource-kind" className={LABEL}>
                  Kind
                </label>
                <select
                  id="resource-kind"
                  name="kind"
                  value={values.kind}
                  onChange={handleChange}
                  className={FIELD}
                >
                  {RESOURCE_KIND_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="resource-file" className={LABEL}>
                File (max 25MB)
              </label>
              <input
                id="resource-file"
                type="file"
                onChange={(event) => {
                  setFile(event.target.files?.[0] ?? null);
                  setFileError(undefined);
                }}
                className="text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-[#f5f5f4] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-ink"
              />
              {fileError ? <span className="text-xs text-red">{fileError}</span> : null}
            </div>

            <FormError message={addErrorMessage} />

            <Button type="submit" isLoading={addPending} className="self-start">
              <PlusIcon size={14} /> {addPending ? "Uploading…" : "Upload resource"}
            </Button>
          </Form>
        )}
      </Formik>

      <div>
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted">Loading resources…</p>
        ) : listErrorMessage ? (
          <FormError message={listErrorMessage} />
        ) : resources.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">{emptyLabel}</p>
        ) : (
          <div className="flex flex-col">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="flex flex-col gap-3 border-b border-line px-1 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-[#eef2ff] px-2 py-0.5 text-[11px] font-bold text-blue">
                      {KIND_LABELS[resource.kind] ?? resource.kind}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-[#f5f5f4] px-2 py-0.5 text-[11px] font-bold uppercase text-muted">
                      {resource.file_type || "file"}
                    </span>
                    <span className="truncate font-display text-[14px] font-bold text-ink">
                      {resource.title}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-line-2 px-3 py-1.5 font-display text-xs font-bold text-ink transition-colors hover:bg-[#fafaf9]"
                  >
                    Open ↗
                  </a>
                  <Button
                    variant="ghost"
                    className="px-3 py-1.5 text-xs text-red"
                    isLoading={deletingId === resource.id}
                    onClick={() => onDelete(resource)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
