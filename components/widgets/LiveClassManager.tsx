"use client";

import { useState } from "react";
import { useLiveClasses } from "@/hooks/query/useLiveClasses";
import { useCreateLiveClass } from "@/hooks/mutations/useCreateLiveClass";
import { useUpdateLiveClass } from "@/hooks/mutations/useUpdateLiveClass";
import { useStartLiveClass } from "@/hooks/mutations/useStartLiveClass";
import { useEndLiveClass } from "@/hooks/mutations/useEndLiveClass";
import { useCancelLiveClass } from "@/hooks/mutations/useCancelLiveClass";
import { useDeleteLiveClass } from "@/hooks/mutations/useDeleteLiveClass";
import { LiveClassRow } from "@/components/widgets/LiveClassRow";
import { AttendanceModal } from "@/components/widgets/AttendanceModal";
import { LiveClassForm } from "@/components/forms/LiveClassForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { extractApiError } from "@/lib/utils/apiError";
import { toDateTimeLocalValue } from "@/lib/utils/datetime";
import type {
  LiveClass,
  LiveClassCreatePayload,
  LiveClassFormValues,
  LiveClassListParams,
  LiveClassStatus,
} from "@/types/liveClass";

const PAGE_SIZE = 10;

type StatusFilter = "all" | LiveClassStatus;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "scheduled", label: "Scheduled" },
  { value: "live", label: "Live" },
  { value: "ended", label: "Ended" },
  { value: "cancelled", label: "Cancelled" },
  { value: "past_due", label: "Past due" },
];

const EMPTY_FORM: LiveClassFormValues = {
  title: "",
  scheduled_at: "",
  total_duration: "60",
  meeting_url: "",
  host_url: "",
  meeting_id: "",
};

interface LiveClassManagerProps {
  batchId: string;
}

export function LiveClassManager({ batchId }: LiveClassManagerProps) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<LiveClass | null>(null);
  const [cancelTarget, setCancelTarget] = useState<LiveClass | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [attendanceId, setAttendanceId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const params: LiveClassListParams = { page, limit: PAGE_SIZE };
  if (statusFilter !== "all") params.status = statusFilter;

  const { data, isLoading, isError, error } = useLiveClasses(batchId, params);

  const createMutation = useCreateLiveClass(batchId);
  const updateMutation = useUpdateLiveClass();
  const startMutation = useStartLiveClass();
  const endMutation = useEndLiveClass();
  const cancelMutation = useCancelLiveClass();
  const deleteMutation = useDeleteLiveClass();

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    createMutation.reset();
    updateMutation.reset();
  };

  const handleStart = (liveClass: LiveClass) => {
    setBusyId(liveClass.id);
    startMutation.mutate(liveClass.id, {
      onSettled: () => setBusyId(null),
      onSuccess: (started) => {
        // Teacher is the host — open the host link (fall back to the join URL).
        const link = started.host_url || started.meeting_url;
        if (link) window.open(link, "_blank", "noopener,noreferrer");
      },
    });
  };

  const handleEnd = (liveClass: LiveClass) => {
    setBusyId(liveClass.id);
    endMutation.mutate(liveClass.id, {
      onSettled: () => setBusyId(null),
      onSuccess: () => setAttendanceId(liveClass.id),
    });
  };

  const handleDelete = (liveClass: LiveClass) => {
    if (!window.confirm(`Delete "${liveClass.title}"? This cannot be undone.`)) {
      return;
    }
    setBusyId(liveClass.id);
    deleteMutation.mutate(liveClass.id, { onSettled: () => setBusyId(null) });
  };

  const handleEdit = (liveClass: LiveClass) => {
    setEditing(liveClass);
    setFormOpen(true);
  };

  const submitForm = async (payload: LiveClassCreatePayload) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    closeForm();
  };

  const confirmCancel = () => {
    if (!cancelTarget) return;
    cancelMutation.mutate(
      { id: cancelTarget.id, cancel_reason: cancelReason.trim() },
      {
        onSuccess: () => {
          setCancelTarget(null);
          setCancelReason("");
        },
      },
    );
  };

  const formInitialValues: LiveClassFormValues = editing
    ? {
        title: editing.title,
        scheduled_at: toDateTimeLocalValue(editing.scheduled_at),
        total_duration: String(editing.total_duration),
        meeting_url: editing.meeting_url,
        host_url: editing.host_url ?? "",
        meeting_id: editing.meeting_id ?? "",
      }
    : EMPTY_FORM;

  const formPending = editing
    ? updateMutation.isPending
    : createMutation.isPending;
  const formError = editing
    ? updateMutation.isError
      ? extractApiError(updateMutation.error)
      : undefined
    : createMutation.isError
      ? extractApiError(createMutation.error)
      : undefined;

  const items = data?.items ?? [];
  const totalPages = data?.pages ?? 1;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="overflow-x-auto">
          <SegmentedTabs
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          />
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <PlusIcon size={14} /> Schedule class
        </Button>
      </div>

      <div className="rounded-[14px] border border-line bg-bg-elev p-5 shadow-[0_1px_2px_rgba(28,27,27,0.03)]">
        {isLoading ? (
          <p className="py-12 text-center text-sm text-muted">
            Loading live classes…
          </p>
        ) : isError ? (
          <FormError message={extractApiError(error)} />
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">
            No live classes{statusFilter !== "all" ? " with this status" : ""} yet.
          </p>
        ) : (
          <div className="flex flex-col">
            {items.map((liveClass) => (
              <LiveClassRow
                key={liveClass.id}
                liveClass={liveClass}
                pending={busyId === liveClass.id}
                onStart={handleStart}
                onEnd={handleEnd}
                onEdit={handleEdit}
                onCancel={(target) => {
                  setCancelTarget(target);
                  setCancelReason("");
                  cancelMutation.reset();
                }}
                onDelete={handleDelete}
                onViewAttendance={(target) => setAttendanceId(target.id)}
              />
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="text-xs text-muted">
              Page {data?.page ?? page} of {totalPages} · {data?.total ?? 0} total
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="px-3 py-1.5 text-xs"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Prev
              </Button>
              <Button
                variant="ghost"
                className="px-3 py-1.5 text-xs"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
              >
                Next <ArrowRightIcon size={13} />
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editing ? "Edit live class" : "Schedule a live class"}
      >
        <LiveClassForm
          initialValues={formInitialValues}
          submitLabel={editing ? "Save changes" : "Schedule class"}
          pending={formPending}
          errorMessage={formError}
          onSubmit={submitForm}
        />
      </Modal>

      <Modal
        open={cancelTarget !== null}
        onClose={() => setCancelTarget(null)}
        title="Cancel live class"
      >
        <div className="flex flex-col gap-4">
          <p className="m-0 text-sm text-muted">
            Cancelling notifies enrolled students. Add a reason so they know why.
          </p>
          <textarea
            value={cancelReason}
            onChange={(event) => setCancelReason(event.target.value)}
            rows={3}
            placeholder="e.g. Rescheduling due to a clash"
            className="w-full resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted-2 focus:border-yellow"
          />
          <FormError
            message={
              cancelMutation.isError
                ? extractApiError(cancelMutation.error)
                : undefined
            }
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCancelTarget(null)}>
              Keep class
            </Button>
            <Button
              variant="danger"
              isLoading={cancelMutation.isPending}
              disabled={cancelReason.trim().length === 0}
              onClick={confirmCancel}
            >
              Cancel class
            </Button>
          </div>
        </div>
      </Modal>

      <AttendanceModal
        liveClassId={attendanceId}
        onClose={() => setAttendanceId(null)}
      />
    </div>
  );
}
