"use client";

import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { useRecordings } from "@/hooks/query/useRecordings";
import { useBatches } from "@/hooks/query/useBatches";
import { useCreateRecording } from "@/hooks/mutations/useCreateRecording";
import { useUpdateRecording } from "@/hooks/mutations/useUpdateRecording";
import { useDeleteRecording } from "@/hooks/mutations/useDeleteRecording";
import { useCookies } from "@/hooks/useCookies";
import { RecordingRow } from "@/components/widgets/RecordingRow";
import { RecordingForm } from "@/components/forms/RecordingForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { listLiveClasses } from "@/lib/api/liveClasses";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { extractApiError } from "@/lib/utils/apiError";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { Recording, RecordingFormValues, RecordingStatus } from "@/types/recording";

type StatusFilter = "all" | RecordingStatus;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "processing", label: "Processing" },
  { value: "draft", label: "Draft" },
  { value: "pending_edit", label: "Pending edit" },
  { value: "published", label: "Published" },
];

const EMPTY_FORM: RecordingFormValues = {
  title: "",
  description: "",
  link: "",
  status: "draft",
};

export function RecordingsPage() {
  const cookies = useCookies();
  const { data: recordings, isLoading, isError, error } = useRecordings();
  const { data: batches } = useBatches();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Recording | null>(null);
  const [createLiveClassId, setCreateLiveClassId] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const batchList = batches ?? [];
  const liveClassQueries = useQueries({
    queries: batchList.map((batch) => ({
      queryKey: QUERY_KEYS.liveClasses.list(batch.id, { page: 1, limit: 100 }),
      queryFn: () =>
        withAuthToken(cookies, (token) =>
          listLiveClasses(token, batch.id, { page: 1, limit: 100 }),
        ),
      enabled: Boolean(batch.id),
      retry: false,
    })),
  });

  const liveClassOptions = liveClassQueries
    .flatMap((result) => result.data?.items ?? [])
    .map((liveClass) => ({
      value: liveClass.id,
      label: liveClass.title,
      sublabel: `${liveClass.batch_name} · ${liveClass.subject_name}`,
    }));

  const createMutation = useCreateRecording(createLiveClassId);
  const updateMutation = useUpdateRecording();
  const deleteMutation = useDeleteRecording();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (recordings ?? []).filter((recording) => {
      const matchesStatus =
        statusFilter === "all" || recording.status === statusFilter;
      const matchesQuery =
        normalized === "" ||
        recording.title.toLowerCase().includes(normalized) ||
        recording.batch_name.toLowerCase().includes(normalized) ||
        recording.live_class_title.toLowerCase().includes(normalized);
      return matchesStatus && matchesQuery;
    });
  }, [recordings, statusFilter, query]);

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    setCreateLiveClassId("");
    createMutation.reset();
    updateMutation.reset();
  };

  const handlePublish = (recording: Recording) => {
    setBusyId(recording.id);
    updateMutation.mutate(
      { id: recording.id, payload: { status: "published" } },
      { onSettled: () => setBusyId(null) },
    );
  };

  const handleDelete = (recording: Recording) => {
    if (!window.confirm(`Delete "${recording.title}"? This cannot be undone.`)) {
      return;
    }
    setBusyId(recording.id);
    deleteMutation.mutate(recording.id, { onSettled: () => setBusyId(null) });
  };

  const submitForm = async (payload: {
    title: string;
    description: string;
    link: string;
    status?: RecordingStatus;
  }) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    closeForm();
  };

  const formInitialValues: RecordingFormValues = editing
    ? {
        title: editing.title,
        description: editing.description,
        link: editing.link,
        status: editing.status,
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

  return (
    <div className="mx-auto w-full max-w-[1100px]">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="m-0 font-display text-[26px] font-extrabold tracking-[-0.01em] text-ink">
            Recordings
          </h1>
          <span className="mt-1 text-sm text-muted">
            Class recordings across your batches. Publish to share with students.
          </span>
        </div>
        <Button
          disabled={liveClassOptions.length === 0}
          onClick={() => {
            setEditing(null);
            setCreateLiveClassId("");
            createMutation.reset();
            setFormOpen(true);
          }}
        >
          <PlusIcon size={14} /> Add recording
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="overflow-x-auto">
          <SegmentedTabs
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
        <label className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-2 text-muted">
          <SearchIcon size={15} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search recordings…"
            className="w-52 min-w-0 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted-2"
          />
        </label>
      </div>

      <div className="rounded-[14px] border border-line bg-bg-elev p-5 shadow-[0_1px_2px_rgba(28,27,27,0.03)]">
        {isLoading ? (
          <p className="py-12 text-center text-sm text-muted">
            Loading recordings…
          </p>
        ) : isError ? (
          <FormError message={extractApiError(error)} />
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">
            No recordings found.
          </p>
        ) : (
          <div className="flex flex-col">
            {filtered.map((recording) => (
              <RecordingRow
                key={recording.id}
                recording={recording}
                pending={busyId === recording.id}
                onPublish={handlePublish}
                onEdit={(target) => {
                  setEditing(target);
                  setFormOpen(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editing ? "Edit recording" : "Add a recording"}
      >
        {editing ? (
          <RecordingForm
            initialValues={formInitialValues}
            submitLabel="Save changes"
            pending={formPending}
            errorMessage={formError}
            onSubmit={submitForm}
          />
        ) : (
          <div className="flex flex-col gap-4">
            <SearchableSelect
              label="Live class"
              placeholder="Search live classes…"
              options={liveClassOptions}
              value={createLiveClassId}
              onChange={setCreateLiveClassId}
            />
            <RecordingForm
              initialValues={EMPTY_FORM}
              submitLabel="Add recording"
              pending={formPending}
              errorMessage={formError}
              disabled={!createLiveClassId}
              onSubmit={submitForm}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
