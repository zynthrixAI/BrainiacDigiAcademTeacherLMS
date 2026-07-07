import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ResourceManager } from "@/components/widgets/ResourceManager";
import { useAddRecordingResource } from "@/hooks/mutations/useAddRecordingResource";
import { useDeleteRecordingResource } from "@/hooks/mutations/useDeleteRecordingResource";
import { extractApiError } from "@/lib/utils/apiError";
import type { Recording, RecordingStatus } from "@/types/recording";
import type { ResourceItem } from "@/types/resource";

const STATUS_STYLES: Record<RecordingStatus, { label: string; className: string }> = {
  processing: { label: "Processing", className: "bg-[#eef2ff] text-blue" },
  draft: { label: "Draft", className: "bg-[#f5f5f4] text-muted" },
  pending_edit: { label: "Pending edit", className: "bg-[#fef3c7] text-[#92400e]" },
  published: { label: "Published", className: "bg-[#ecfdf5] text-green" },
};

const ACTION = "px-3 py-1.5 text-xs";

interface RecordingRowProps {
  recording: Recording;
  pending: boolean;
  onPublish: (recording: Recording) => void;
  onEdit: (recording: Recording) => void;
  onDelete: (recording: Recording) => void;
}

export function RecordingRow({
  recording,
  pending,
  onPublish,
  onEdit,
  onDelete,
}: RecordingRowProps) {
  const status = STATUS_STYLES[recording.status];

  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const addResourceMutation = useAddRecordingResource(recording.id);
  const deleteResourceMutation = useDeleteRecordingResource();

  const resources = recording.resources ?? [];

  const handleAddResource = async (formData: FormData) => {
    await addResourceMutation.mutateAsync(formData);
  };

  const handleDeleteResource = (resource: ResourceItem) => {
    if (!window.confirm(`Delete "${resource.title}"? This cannot be undone.`)) {
      return;
    }
    setDeletingId(resource.id);
    deleteResourceMutation.mutate(
      { recordingId: recording.id, resourceId: resource.id },
      { onSettled: () => setDeletingId(null) },
    );
  };

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
            {recording.title}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <span className="font-semibold text-ink-2">{recording.batch_name}</span>
          <span>·</span>
          <span>{recording.subject_name}</span>
          <span>·</span>
          <span className="truncate">{recording.live_class_title}</span>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <a
          href={recording.link}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-line-2 px-3 py-1.5 font-display text-xs font-bold text-ink transition-colors hover:bg-[#fafaf9]"
        >
          Open ↗
        </a>
        {recording.status !== "published" ? (
          <Button
            className={ACTION}
            isLoading={pending}
            onClick={() => onPublish(recording)}
          >
            Publish
          </Button>
        ) : null}
        <Button
          variant="ghost"
          className={ACTION}
          disabled={pending}
          onClick={() => onEdit(recording)}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          className={ACTION}
          onClick={() => setResourcesOpen(true)}
        >
          Resources ({resources.length})
        </Button>
        <Button
          variant="ghost"
          className={`${ACTION} text-red`}
          disabled={pending}
          onClick={() => onDelete(recording)}
        >
          Delete
        </Button>
      </div>

      <Modal
        open={resourcesOpen}
        onClose={() => setResourcesOpen(false)}
        title={`Resources — ${recording.title}`}
        widthClassName="max-w-xl"
      >
        <ResourceManager
          resources={resources}
          addPending={addResourceMutation.isPending}
          addErrorMessage={
            addResourceMutation.isError
              ? extractApiError(addResourceMutation.error)
              : undefined
          }
          deletingId={deletingId}
          onAdd={handleAddResource}
          onDelete={handleDeleteResource}
          emptyLabel="No resources on this recording yet."
        />
      </Modal>
    </div>
  );
}
