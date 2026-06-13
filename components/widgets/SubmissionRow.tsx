import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils/datetime";
import { getGradeState, type GradeState } from "@/lib/utils/submission";
import type { Submission } from "@/types/submission";

const STATE_STYLES: Record<GradeState, { label: string; className: string }> = {
  ungraded: { label: "Not graded", className: "bg-[#f5f5f4] text-muted" },
  draft: { label: "Draft", className: "bg-[#fef3c7] text-[#92400e]" },
  released: { label: "Released", className: "bg-[#ecfdf5] text-green" },
};

interface SubmissionRowProps {
  submission: Submission;
  totalMarks: number;
  onReview: (submission: Submission) => void;
}

export function SubmissionRow({
  submission,
  totalMarks,
  onReview,
}: SubmissionRowProps) {
  const state = STATE_STYLES[getGradeState(submission)];
  const marks = submission.grade ? submission.grade.total_marks : null;

  return (
    <div className="flex flex-col gap-3 border-b border-line px-1 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${state.className}`}
          >
            {state.label}
          </span>
          <span className="truncate font-display text-[14px] font-bold text-ink">
            {submission.student_name}
          </span>
          {submission.is_late ? (
            <span className="inline-flex items-center rounded-full bg-[#fef2f2] px-2 py-0.5 text-[11px] font-bold text-red">
              Late
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <span className="truncate">{submission.student_email}</span>
          <span>·</span>
          <span>{formatDateTime(submission.submitted_at)}</span>
          {submission.submission_number > 1 ? (
            <>
              <span>·</span>
              <span>Resubmission #{submission.submission_number}</span>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="font-display text-sm font-bold text-ink">
          {marks === null ? "—" : `${marks} / ${totalMarks}`}
        </span>
        <Button
          variant="ghost"
          className="px-3 py-1.5 text-xs"
          onClick={() => onReview(submission)}
        >
          Review
        </Button>
      </div>
    </div>
  );
}
