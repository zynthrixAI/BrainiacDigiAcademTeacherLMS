"use client";

import { useState } from "react";
import { useRecordings } from "@/hooks/query/useRecordings";
import { useLiveClasses } from "@/hooks/query/useLiveClasses";
import { useCreateRecording } from "@/hooks/mutations/useCreateRecording";
import { useUpdateRecording } from "@/hooks/mutations/useUpdateRecording";
import { useDeleteRecording } from "@/hooks/mutations/useDeleteRecording";
import { RecordingRow } from "@/components/widgets/RecordingRow";
import { RecordingForm } from "@/components/forms/RecordingForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { extractApiError } from "@/lib/utils/apiError";
import { formatDateTime } from "@/lib/utils/datetime";
import type {
  Recording,
  RecordingCreatePayload,
  RecordingFormValues,
  RecordingStatus,
} from "@/types/recording";

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

interface RecordingManagerProps {
  batchId: string;
}

export function RecordingManager({ batchId }: RecordingManagerProps) {
  const { data: recordings, isLoading, isError, error } = useRecordings();
  const { data: liveClasses } = useLiveClasses(batchId, { page: 1, limit: 100 });

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Recording | null>(null);
  const [createLiveClassId, setCreateLiveClassId] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const createMutation = useCreateRecording(createLiveClassId);
  const updateMutation = useUpdateRecording();
  const deleteMutation = useDeleteRecording();

  const liveClassOptions = (liveClasses?.items ?? []).map((liveClass) => ({
    value: liveClass.id,
    label: liveClass.title,
    sublabel: formatDateTime(liveClass.scheduled_at),
  }));

  const items = (recordings ?? []).filter(
    (recording) =>
      recording.batch_id === batchId &&
      (statusFilter === "all" || recording.status === statusFilter),
  );

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

  const submitForm = async (payload: RecordingCreatePayload) => {
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
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="overflow-x-auto">
          <SegmentedTabs
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={setStatusFilter}
          />
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

      <div className="rounded-[14px] border border-line bg-bg-elev p-5 shadow-[0_1px_2px_rgba(28,27,27,0.03)]">
        {isLoading ? (
          <p className="py-12 text-center text-sm text-muted">
            Loading recordings…
          </p>
        ) : isError ? (
          <FormError message={extractApiError(error)} />
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">
            No recordings{statusFilter !== "all" ? " with this status" : ""} yet.
          </p>
        ) : (
          <div className="flex flex-col">
            {items.map((recording) => (
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
