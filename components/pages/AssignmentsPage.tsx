"use client";

import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { useBatches } from "@/hooks/query/useBatches";
import { useCookies } from "@/hooks/useCookies";
import { useCreateAssignment } from "@/hooks/mutations/useCreateAssignment";
import { useUpdateAssignment } from "@/hooks/mutations/useUpdateAssignment";
import { useDeleteAssignment } from "@/hooks/mutations/useDeleteAssignment";
import { AssignmentRow } from "@/components/widgets/AssignmentRow";
import { AssignmentForm } from "@/components/forms/AssignmentForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { listAssignments } from "@/lib/api/assignments";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { extractApiError } from "@/lib/utils/apiError";
import { toDateTimeLocalValue } from "@/lib/utils/datetime";
import { QUERY_KEYS } from "@/lib/queryKeys";
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

export function AssignmentsPage() {
  const cookies = useCookies();
  const { data: batches, isLoading: batchesLoading } = useBatches();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);
  const [createBatchId, setCreateBatchId] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const batchList = batches ?? [];
  const batchName = (batchId: string) =>
    batchList.find((batch) => batch.id === batchId)?.name;

  const results = useQueries({
    queries: batchList.map((batch) => ({
      queryKey: QUERY_KEYS.assignments.list(batch.id),
      queryFn: () =>
        withAuthToken(cookies, (token) => listAssignments(token, batch.id)),
      enabled: Boolean(batch.id),
      retry: false,
    })),
  });

  const createMutation = useCreateAssignment(createBatchId);
  const updateMutation = useUpdateAssignment();
  const deleteMutation = useDeleteAssignment();

  const items = results
    .flatMap((result) => result.data ?? [])
    .filter(
      (assignment) =>
        (statusFilter === "all" || assignment.status === statusFilter) &&
        (batchFilter === "all" || assignment.batch_id === batchFilter),
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  const classesLoading = results.some((result) => result.isLoading);
  const firstError = results.find((result) => result.isError)?.error;
  const hasBatches = batchList.length > 0;

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
    <div className="mx-auto w-full max-w-[1100px]">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="m-0 font-display text-[26px] font-extrabold tracking-[-0.01em] text-ink">
            Assignments
          </h1>
          <span className="mt-1 text-sm text-muted">
            Assignments across your batches.
          </span>
        </div>
        <Button
          disabled={!hasBatches}
          onClick={() => {
            setEditing(null);
            setCreateBatchId(batchFilter !== "all" ? batchFilter : "");
            createMutation.reset();
            setFormOpen(true);
          }}
        >
          <PlusIcon size={14} /> New assignment
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
            Loading assignments…
          </p>
        ) : firstError ? (
          <FormError message={extractApiError(firstError)} />
        ) : !hasBatches ? (
          <p className="py-12 text-center text-sm text-muted">
            You have no batches assigned yet, so there are no assignments.
          </p>
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
                batchName={batchName(assignment.batch_id)}
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
        {editing && editInitialValues ? (
          <AssignmentForm
            initialValues={editInitialValues}
            initialRubric={editing.rubric}
            initialFileUrl={editing.file_url}
            showStatus
            submitLabel="Save changes"
            pending={formPending}
            errorMessage={formError}
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
            <AssignmentForm
              initialValues={EMPTY_FORM}
              initialRubric={[]}
              showStatus={false}
              submitLabel="Create assignment"
              pending={formPending}
              errorMessage={formError}
              disabled={!createBatchId}
              onSubmit={submitForm}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
