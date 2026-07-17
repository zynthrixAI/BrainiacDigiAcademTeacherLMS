"use client";

import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { useBatches } from "@/hooks/query/useBatches";
import { useZoomStatus } from "@/hooks/query/useZoomStatus";
import { useCookies } from "@/hooks/useCookies";
import { useCreateLiveClass } from "@/hooks/mutations/useCreateLiveClass";
import { useUpdateLiveClass } from "@/hooks/mutations/useUpdateLiveClass";
import { useStartLiveClass } from "@/hooks/mutations/useStartLiveClass";
import { useEndLiveClass } from "@/hooks/mutations/useEndLiveClass";
import { useCancelLiveClass } from "@/hooks/mutations/useCancelLiveClass";
import { useDeleteLiveClass } from "@/hooks/mutations/useDeleteLiveClass";
import { LiveClassRow } from "@/components/widgets/LiveClassRow";
import { AttendanceModal } from "@/components/widgets/AttendanceModal";
import { RecurringScheduler } from "@/components/widgets/RecurringScheduler";
import { LiveClassForm } from "@/components/forms/LiveClassForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { listLiveClasses } from "@/lib/api/liveClasses";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { extractApiError } from "@/lib/utils/apiError";
import { toDateTimeLocalValue } from "@/lib/utils/datetime";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type {
  LiveClass,
  LiveClassCreatePayload,
  LiveClassFormValues,
  LiveClassListParams,
  LiveClassStatus,
} from "@/types/liveClass";

const PER_BATCH_LIMIT = 100;

type StatusFilter = "all" | LiveClassStatus;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "scheduled", label: "Scheduled" },
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

export function LiveClassesPage() {
  const cookies = useCookies();
  const { data: batches, isLoading: batchesLoading, isError: batchesError, error: batchesErr } =
    useBatches();
  const { data: zoomStatus } = useZoomStatus();
  const zoomConnected = zoomStatus?.connected ?? false;

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [seriesOpen, setSeriesOpen] = useState(false);
  const [editing, setEditing] = useState<LiveClass | null>(null);
  const [createBatchId, setCreateBatchId] = useState("");
  const [cancelTarget, setCancelTarget] = useState<LiveClass | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [attendanceId, setAttendanceId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const params: LiveClassListParams = { page: 1, limit: PER_BATCH_LIMIT };
  if (statusFilter !== "all") params.status = statusFilter;

  const batchList = useMemo(() => batches ?? [], [batches]);

  const results = useQueries({
    queries: batchList.map((batch) => ({
      queryKey: QUERY_KEYS.liveClasses.list(batch.id, params),
      queryFn: () =>
        withAuthToken(cookies, (token) =>
          listLiveClasses(token, batch.id, params),
        ),
      enabled: Boolean(batch.id),
      retry: false,
    })),
  });

  const createMutation = useCreateLiveClass(createBatchId);
  const updateMutation = useUpdateLiveClass();
  const startMutation = useStartLiveClass();
  const endMutation = useEndLiveClass();
  const cancelMutation = useCancelLiveClass();
  const deleteMutation = useDeleteLiveClass();

  const items = results
    .flatMap((result) => result.data?.items ?? [])
    .filter(
      (liveClass) =>
        batchFilter === "all" || liveClass.batch_id === batchFilter,
    )
    .sort(
      (a, b) =>
        new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime(),
    );

  const classesLoading = results.some((result) => result.isLoading);
  const firstError = results.find((result) => result.isError)?.error;

  // Group the flat cross-batch list into one collapsible section per batch, in
  // the teacher's batch order. A single long list of every class is hard to
  // scan; sections keep each batch's schedule together.
  const groups = useMemo(() => {
    const byBatch = new Map<string, LiveClass[]>();
    for (const liveClass of items) {
      const bucket = byBatch.get(liveClass.batch_id) ?? [];
      bucket.push(liveClass);
      byBatch.set(liveClass.batch_id, bucket);
    }
    return batchList
      .filter((batch) => byBatch.has(batch.id))
      .map((batch) => ({
        batchId: batch.id,
        batchName: batch.name,
        subjectName: batch.subject_name,
        classes: byBatch.get(batch.id) ?? [],
      }));
  }, [items, batchList]);

  // Which sections are expanded. `null` = the default: expand everything when
  // there's just one section, otherwise start collapsed for a clean overview.
  const [openBatches, setOpenBatches] = useState<Set<string> | null>(null);
  const singleGroup = groups.length === 1;
  const isBatchOpen = (batchId: string) =>
    openBatches === null ? singleGroup : openBatches.has(batchId);
  const toggleBatch = (batchId: string) => {
    setOpenBatches((prev) => {
      const base =
        prev ?? new Set(singleGroup ? groups.map((group) => group.batchId) : []);
      const next = new Set(base);
      if (next.has(batchId)) next.delete(batchId);
      else next.add(batchId);
      return next;
    });
  };

  const batchOptions = batchList.map((batch) => ({
    value: batch.id,
    label: batch.name,
    sublabel: batch.subject_name,
  }));

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    setCreateBatchId("");
    createMutation.reset();
    updateMutation.reset();
  };

  const handleStart = (liveClass: LiveClass) => {
    setBusyId(liveClass.id);
    startMutation.mutate(liveClass.id, {
      onSettled: () => setBusyId(null),
      onSuccess: (started) => {
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
    const message =
      liveClass.status === "ended" || liveClass.status === "past_due"
        ? `Delete "${liveClass.title}"? This class has already happened and this cannot be undone.`
        : `Delete "${liveClass.title}"? This cannot be undone.`;
    if (!window.confirm(message)) {
      return;
    }
    setBusyId(liveClass.id);
    deleteMutation.mutate(liveClass.id, { onSettled: () => setBusyId(null) });
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
        meeting_url: editing.meeting_url ?? "",
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

  const hasBatches = batchList.length > 0;

  return (
    <div className="mx-auto w-full max-w-[1100px]">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="m-0 font-display text-[26px] font-extrabold tracking-[-0.01em] text-ink">
            Live classes
          </h1>
          <span className="mt-1 text-sm text-muted">
            Every live class across your batches.
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            disabled={!hasBatches}
            onClick={() => setSeriesOpen(true)}
          >
            Schedule series
          </Button>
          <Button
            disabled={!hasBatches}
            onClick={() => {
              setEditing(null);
              setCreateBatchId(batchFilter !== "all" ? batchFilter : "");
              createMutation.reset();
              setFormOpen(true);
            }}
          >
            <PlusIcon size={14} /> Schedule class
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="overflow-x-auto">
          <SegmentedTabs
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
        {hasBatches ? (
          <select
            value={batchFilter}
            onChange={(event) => setBatchFilter(event.target.value)}
            className="rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-yellow"
          >
            <option value="all">All batches</option>
            {batchList.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.name}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      <div className="rounded-[14px] border border-line bg-bg-elev p-5 shadow-[0_1px_2px_rgba(28,27,27,0.03)]">
        {batchesLoading || classesLoading ? (
          <p className="py-12 text-center text-sm text-muted">
            Loading live classes…
          </p>
        ) : batchesError ? (
          <FormError message={extractApiError(batchesErr)} />
        ) : firstError ? (
          <FormError message={extractApiError(firstError)} />
        ) : !hasBatches ? (
          <p className="py-12 text-center text-sm text-muted">
            You have no batches assigned yet, so there are no live classes to run.
          </p>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">
            No live classes{statusFilter !== "all" ? " with this status" : ""} yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {deleteMutation.isError ? (
              <FormError message={extractApiError(deleteMutation.error)} />
            ) : null}
            {groups.map((group) => {
              const open = isBatchOpen(group.batchId);
              return (
                <div
                  key={group.batchId}
                  className="overflow-hidden rounded-[12px] border border-line"
                >
                  <button
                    type="button"
                    onClick={() => toggleBatch(group.batchId)}
                    aria-expanded={open}
                    className="flex w-full items-center gap-3 bg-[#fafaf9] px-4 py-3 text-left transition-colors hover:bg-[#f4f4f5]"
                  >
                    <ArrowRightIcon
                      size={14}
                      className={`shrink-0 text-muted transition-transform ${
                        open ? "rotate-90" : ""
                      }`}
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-display text-sm font-bold text-ink">
                        {group.batchName}
                      </span>
                      <span className="truncate text-xs text-muted">
                        {group.subjectName}
                      </span>
                    </div>
                    <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-muted">
                      {group.classes.length}{" "}
                      {group.classes.length === 1 ? "class" : "classes"}
                    </span>
                  </button>
                  {open ? (
                    <div className="flex flex-col border-t border-line px-4">
                      {group.classes.map((liveClass) => (
                        <LiveClassRow
                          key={liveClass.id}
                          liveClass={liveClass}
                          pending={busyId === liveClass.id}
                          onStart={handleStart}
                          onEnd={handleEnd}
                          onEdit={(target) => {
                            setEditing(target);
                            setFormOpen(true);
                          }}
                          onCancel={(target) => {
                            setCancelTarget(target);
                            setCancelReason("");
                            cancelMutation.reset();
                          }}
                          onDelete={handleDelete}
                          onViewAttendance={(target) =>
                            setAttendanceId(target.id)
                          }
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editing ? "Edit live class" : "Schedule a live class"}
      >
        {editing ? (
          <LiveClassForm
            initialValues={formInitialValues}
            submitLabel="Save changes"
            pending={formPending}
            errorMessage={formError}
            zoomConnected={zoomConnected}
            onSubmit={submitForm}
          />
        ) : (
          <div className="flex flex-col gap-4">
            <SearchableSelect
              label="Batch"
              placeholder="Search batches…"
              options={batchOptions}
              value={createBatchId}
              onChange={setCreateBatchId}
            />
            <LiveClassForm
              initialValues={EMPTY_FORM}
              submitLabel="Schedule class"
              pending={formPending}
              errorMessage={formError}
              disabled={!createBatchId}
              zoomConnected={zoomConnected}
              onSubmit={submitForm}
            />
          </div>
        )}
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

      <RecurringScheduler
        open={seriesOpen}
        onClose={() => setSeriesOpen(false)}
        zoomConnected={zoomConnected}
        fixedBatchId={batchFilter !== "all" ? batchFilter : undefined}
        batchOptions={batchOptions}
      />
    </div>
  );
}
