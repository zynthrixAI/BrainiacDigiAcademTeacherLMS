"use client";

import { useState } from "react";
import { useAssignments } from "@/hooks/query/useAssignments";
import { useCreateAssignment } from "@/hooks/mutations/useCreateAssignment";
import { useUpdateAssignment } from "@/hooks/mutations/useUpdateAssignment";
import { useDeleteAssignment } from "@/hooks/mutations/useDeleteAssignment";
import { AssignmentRow } from "@/components/widgets/AssignmentRow";
import { AssignmentForm } from "@/components/forms/AssignmentForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { extractApiError } from "@/lib/utils/apiError";
import { toDateTimeLocalValue } from "@/lib/utils/datetime";
import type {
  Assignment,
  AssignmentFormValues,
  AssignmentStatus,
} from "@/types/assignment";

type StatusFilter = "all" | AssignmentStatus;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
];

const EMPTY_FORM: AssignmentFormValues = {
  title: "",
  instructions: "",
  deadline: "",
  allow_resubmission: false,
  status: "active",
};

interface AssignmentManagerProps {
  batchId: string;
}

export function AssignmentManager({ batchId }: AssignmentManagerProps) {
  const { data: assignments, isLoading, isError, error } =
    useAssignments(batchId);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const createMutation = useCreateAssignment(batchId);
  const updateMutation = useUpdateAssignment();
  const deleteMutation = useDeleteAssignment();

  const items = (assignments ?? [])
    .filter(
      (assignment) =>
        statusFilter === "all" || assignment.status === statusFilter,
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    createMutation.reset();
    updateMutation.reset();
  };

  const handleToggleStatus = (assignment: Assignment) => {
    const formData = new FormData();
    formData.append(
      "status",
      assignment.status === "active" ? "closed" : "active",
    );
    setBusyId(assignment.id);
    updateMutation.mutate(
      { id: assignment.id, formData },
      { onSettled: () => setBusyId(null) },
    );
  };

  const handleDelete = (assignment: Assignment) => {
    if (
      !window.confirm(`Delete "${assignment.title}"? This cannot be undone.`)
    ) {
      return;
    }
    setBusyId(assignment.id);
    deleteMutation.mutate(assignment.id, { onSettled: () => setBusyId(null) });
  };

  const submitForm = async (formData: FormData) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    closeForm();
  };

  const editInitialValues: AssignmentFormValues | null = editing
    ? {
        title: editing.title,
        instructions: editing.instructions,
        deadline: toDateTimeLocalValue(editing.deadline),
        allow_resubmission: editing.allow_resubmission,
        status: editing.status,
      }
    : null;

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
          onClick={() => {
            setEditing(null);
            createMutation.reset();
            setFormOpen(true);
          }}
        >
          <PlusIcon size={14} /> New assignment
        </Button>
      </div>

      <div className="rounded-[14px] border border-line bg-bg-elev p-5 shadow-[0_1px_2px_rgba(28,27,27,0.03)]">
        {isLoading ? (
          <p className="py-12 text-center text-sm text-muted">
            Loading assignments…
          </p>
        ) : isError ? (
          <FormError message={extractApiError(error)} />
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">
            No assignments{statusFilter !== "all" ? " with this status" : ""} yet.
          </p>
        ) : (
          <div className="flex flex-col">
            {items.map((assignment) => (
              <AssignmentRow
                key={assignment.id}
                assignment={assignment}
                pending={busyId === assignment.id}
                onEdit={(target) => {
                  setEditing(target);
                  setFormOpen(true);
                }}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editing ? "Edit assignment" : "New assignment"}
        widthClassName="max-w-lg"
      >
        <AssignmentForm
          initialValues={editInitialValues ?? EMPTY_FORM}
          initialRubric={editing?.rubric ?? []}
          initialFileUrl={editing?.file_url}
          showStatus={editing !== null}
          submitLabel={editing ? "Save changes" : "Create assignment"}
          pending={formPending}
          errorMessage={formError}
          onSubmit={submitForm}
        />
      </Modal>
    </div>
  );
}
