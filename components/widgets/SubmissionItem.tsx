import type { RecentSubmission } from "@/types/dashboard";

interface SubmissionItemProps {
  submission: RecentSubmission;
}

export function SubmissionItem({ submission }: SubmissionItemProps) {
  const isPending = submission.status === "pending";

  return (
    <div className="flex items-center gap-3">
      <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-yellow-soft font-display text-[12px] font-extrabold text-yellow-ink">
        {submission.studentInitials}
      </span>

      <div className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="truncate text-[13px] font-bold text-ink">
          {submission.studentName}
        </span>
        <span className="truncate text-xs text-muted">
          {submission.assignmentTitle} · {submission.subjectCode}
        </span>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
            isPending
              ? "bg-yellow-soft text-yellow-ink"
              : "bg-[#ecfdf5] text-green"
          }`}
        >
          {isPending ? "To grade" : "Graded"}
        </span>
        <span className="text-[11px] text-muted-2">{submission.submittedAt}</span>
      </div>
    </div>
  );
}
