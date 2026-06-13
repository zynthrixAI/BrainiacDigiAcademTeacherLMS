"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { GradeForm } from "@/components/forms/GradeForm";
import { useGradeSubmission } from "@/hooks/mutations/useGradeSubmission";
import { useReleaseGrade } from "@/hooks/mutations/useReleaseGrade";
import { extractApiError } from "@/lib/utils/apiError";
import { formatDateTime } from "@/lib/utils/datetime";
import { getGradeState, type GradeState } from "@/lib/utils/submission";
import { CDN_BASE } from "@/lib/constants";
import type { RubricCriterion } from "@/types/assignment";
import type { GradeRequest, Submission } from "@/types/submission";

const STATE_PILL: Record<GradeState, { label: string; className: string }> = {
  ungraded: { label: "Not yet graded", className: "bg-[#f5f5f4] text-muted" },
  draft: {
    label: "Draft — not released",
    className: "bg-[#fef3c7] text-[#92400e]",
  },
  released: { label: "Released to student", className: "bg-[#ecfdf5] text-green" },
};

interface SubmissionGradeModalProps {
  submission: Submission;
  rubric: RubricCriterion[];
  onClose: () => void;
}

export function SubmissionGradeModal({
  submission,
  rubric,
  onClose,
}: SubmissionGradeModalProps) {
  const [current, setCurrent] = useState(submission);
  const gradeMutation = useGradeSubmission();
  const releaseMutation = useReleaseGrade();

  const state = getGradeState(current);
  const pill = STATE_PILL[state];

  const handleSave = async (body: GradeRequest) => {
    const updated = await gradeMutation.mutateAsync({
      submissionId: current.id,
      body,
    });
    setCurrent(updated);
  };

  const handleRelease = () => {
    releaseMutation.mutate(current.id, {
      onSuccess: (updated) => setCurrent(updated),
    });
  };

  return (
    <Modal open onClose={onClose} title="Submission" widthClassName="max-w-2xl">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base font-extrabold text-ink">
              {current.student_name}
            </span>
            <span className="text-xs text-muted">{current.student_email}</span>
            <span className="mt-1 text-xs text-muted">
              Submitted {formatDateTime(current.submitted_at)}
              {current.submission_number > 1
                ? ` · resubmission #${current.submission_number}`
                : ""}
              {current.is_late ? " · late" : ""}
            </span>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${pill.className}`}
          >
            {pill.label}
          </span>
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-line bg-[#faf9f7] p-3">
          <span className="font-display text-[12.5px] font-bold text-ink-2">
            Files
          </span>
          {current.files.length === 0 ? (
            <span className="text-xs text-muted">No files attached.</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {current.files.map((file) => (
                <a
                  key={file.s3_key}
                  href={`${CDN_BASE}/${file.s3_key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-[#fafaf9]"
                >
                  {file.file_name}
                  <span className="uppercase text-muted-2">
                    {file.file_type}
                  </span>{" "}
                  ↗
                </a>
              ))}
            </div>
          )}
        </div>

        <GradeForm
          rubric={rubric}
          grade={current.grade}
          saving={gradeMutation.isPending}
          errorMessage={
            gradeMutation.isError
              ? extractApiError(gradeMutation.error)
              : undefined
          }
          onSave={handleSave}
        />

        <div className="flex flex-col gap-2 border-t border-line pt-4">
          <FormError
            message={
              releaseMutation.isError
                ? extractApiError(releaseMutation.error)
                : undefined
            }
          />
          {!current.grade ? (
            <p className="m-0 text-xs text-muted">
              Save a grade first, then release it to notify the student.
            </p>
          ) : null}
          <Button
            onClick={handleRelease}
            isLoading={releaseMutation.isPending}
            disabled={!current.grade || state === "released"}
            className="w-full"
          >
            {state === "released" ? "Released" : "Release to student"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
