import { Button } from "@/components/ui/Button";
import { ClockIcon } from "@/components/icons/ClockIcon";
import { formatDateTime } from "@/lib/utils/datetime";
import type { LiveClass, LiveClassStatus } from "@/types/liveClass";

const STATUS_STYLES: Record<LiveClassStatus, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "bg-[#eef2ff] text-blue" },
  live: { label: "● Live", className: "bg-[#fef2f2] text-red" },
  ended: { label: "Ended", className: "bg-[#ecfdf5] text-green" },
  cancelled: { label: "Cancelled", className: "bg-[#f5f5f4] text-muted" },
  past_due: { label: "Past due", className: "bg-[#fef3c7] text-[#92400e]" },
};

const ACTION = "px-3 py-1.5 text-xs";

interface LiveClassRowProps {
  liveClass: LiveClass;
  pending: boolean;
  /** Show the batch name in the meta line (for cross-batch views). */
  showBatch?: boolean;
  onStart: (liveClass: LiveClass) => void;
  onEnd: (liveClass: LiveClass) => void;
  onEdit: (liveClass: LiveClass) => void;
  onCancel: (liveClass: LiveClass) => void;
  onDelete: (liveClass: LiveClass) => void;
  onViewAttendance: (liveClass: LiveClass) => void;
}

export function LiveClassRow({
  liveClass,
  pending,
  showBatch = false,
  onStart,
  onEnd,
  onEdit,
  onCancel,
  onDelete,
  onViewAttendance,
}: LiveClassRowProps) {
  const status = STATUS_STYLES[liveClass.status];

  return (
    <div className="flex flex-col gap-3 border-b border-line px-1 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${status.className}`}
          >
            {status.label}
          </span>
          <span className="truncate font-display text-[14px] font-bold text-ink">
            {liveClass.title}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
          {showBatch ? (
            <>
              <span className="font-semibold text-ink-2">
                {liveClass.batch_name}
              </span>
              <span>·</span>
            </>
          ) : null}
          <ClockIcon size={13} />
          <span>{formatDateTime(liveClass.scheduled_at)}</span>
          <span>·</span>
          <span>{liveClass.total_duration} min</span>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {liveClass.status === "scheduled" ? (
          <>
            <Button
              className={ACTION}
              onClick={() => onStart(liveClass)}
              isLoading={pending}
            >
              Start
            </Button>
            <Button
              variant="ghost"
              className={ACTION}
              disabled={pending}
              onClick={() => onEdit(liveClass)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              className={ACTION}
              disabled={pending}
              onClick={() => onCancel(liveClass)}
            >
              Cancel
            </Button>
            <Button
              variant="ghost"
              className={`${ACTION} text-red`}
              disabled={pending}
              onClick={() => onDelete(liveClass)}
            >
              Delete
            </Button>
          </>
        ) : null}

        {liveClass.status === "live" ? (
          <>
            <Button
              variant="danger"
              className={ACTION}
              isLoading={pending}
              onClick={() => onEnd(liveClass)}
            >
              End class
            </Button>
            <Button
              variant="ghost"
              className={ACTION}
              disabled={pending}
              onClick={() => onCancel(liveClass)}
            >
              Cancel
            </Button>
            <Button
              variant="ghost"
              className={ACTION}
              disabled={pending}
              onClick={() => onViewAttendance(liveClass)}
            >
              Attendance
            </Button>
          </>
        ) : null}

        {liveClass.status === "ended" ? (
          <>
            <Button
              variant="ghost"
              className={ACTION}
              disabled={pending}
              onClick={() => onViewAttendance(liveClass)}
            >
              Attendance
            </Button>
            <Button
              variant="ghost"
              className={`${ACTION} text-red`}
              disabled={pending}
              onClick={() => onDelete(liveClass)}
            >
              Delete
            </Button>
          </>
        ) : null}

        {liveClass.status === "cancelled" || liveClass.status === "past_due" ? (
          <Button
            variant="ghost"
            className={`${ACTION} text-red`}
            disabled={pending}
            onClick={() => onDelete(liveClass)}
          >
            Delete
          </Button>
        ) : null}
      </div>
    </div>
  );
}
