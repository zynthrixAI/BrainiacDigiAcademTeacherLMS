import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils/datetime";
import { ROUTES } from "@/lib/constants";
import type { Assignment } from "@/types/assignment";

const ACTION = "px-3 py-1.5 text-xs";

interface AssignmentRowProps {
  assignment: Assignment;
  pending: boolean;
  batchName?: string;
  onEdit: (assignment: Assignment) => void;
  onToggleStatus: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
}

export function AssignmentRow({
  assignment,
  pending,
  batchName,
  onEdit,
  onToggleStatus,
  onDelete,
}: AssignmentRowProps) {
  const isActive = assignment.status === "active";

  return (
    <div className="flex flex-col gap-3 border-b border-line px-1 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
              isActive ? "bg-[#ecfdf5] text-green" : "bg-[#f5f5f4] text-muted"
            }`}
          >
            {isActive ? "Active" : "Closed"}
          </span>
          <span className="truncate font-display text-[14px] font-bold text-ink">
            {assignment.title}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
          {batchName ? (
            <>
              <span className="font-semibold text-ink-2">{batchName}</span>
              <span>·</span>
            </>
          ) : null}
          <span>Due {formatDateTime(assignment.deadline)}</span>
          <span>·</span>
          <span>{assignment.total_marks} marks</span>
          {assignment.allow_resubmission ? (
            <>
              <span>·</span>
              <span>Resubmission on</span>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {assignment.file_url ? (
          <a
            href={assignment.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-line-2 px-3 py-1.5 font-display text-xs font-bold text-ink transition-colors hover:bg-[#fafaf9]"
          >
            File ↗
          </a>
        ) : null}
        <Link
          href={`${ROUTES.assignments}/${assignment.id}`}
          className="rounded-xl border border-line-2 px-3 py-1.5 font-display text-xs font-bold text-ink transition-colors hover:bg-[#fafaf9]"
        >
          Submissions
        </Link>
        <Button
          variant="ghost"
          className={ACTION}
          disabled={pending}
          onClick={() => onEdit(assignment)}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          className={ACTION}
          isLoading={pending}
          onClick={() => onToggleStatus(assignment)}
        >
          {isActive ? "Close" : "Reopen"}
        </Button>
        <Button
          variant="ghost"
          className={`${ACTION} text-red`}
          disabled={pending}
          onClick={() => onDelete(assignment)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
