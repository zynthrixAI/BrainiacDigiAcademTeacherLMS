"use client";

import { useState } from "react";
import { useBatchMaterials } from "@/hooks/query/useBatchMaterials";
import { useAddBatchMaterial } from "@/hooks/mutations/useAddBatchMaterial";
import { useDeleteBatchMaterial } from "@/hooks/mutations/useDeleteBatchMaterial";
import { ResourceManager } from "@/components/widgets/ResourceManager";
import { extractApiError } from "@/lib/utils/apiError";
import type { ResourceItem } from "@/types/resource";

interface BatchMaterialsManagerProps {
  batchId: string;
}

export function BatchMaterialsManager({ batchId }: BatchMaterialsManagerProps) {
  const { data: materials, isLoading, isError, error } =
    useBatchMaterials(batchId);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const addMutation = useAddBatchMaterial(batchId);
  const deleteMutation = useDeleteBatchMaterial(batchId);

  const handleAdd = async (formData: FormData) => {
    await addMutation.mutateAsync(formData);
  };

  const handleDelete = (resource: ResourceItem) => {
    if (!window.confirm(`Delete "${resource.title}"? This cannot be undone.`)) {
      return;
    }
    setDeletingId(resource.id);
    deleteMutation.mutate(resource.id, { onSettled: () => setDeletingId(null) });
  };

  return (
    <div className="rounded-[14px] border border-line bg-bg-elev p-5 shadow-[0_1px_2px_rgba(28,27,27,0.03)]">
      <ResourceManager
        resources={materials ?? []}
        isLoading={isLoading}
        listErrorMessage={isError ? extractApiError(error) : undefined}
        addPending={addMutation.isPending}
        addErrorMessage={
          addMutation.isError ? extractApiError(addMutation.error) : undefined
        }
        deletingId={deletingId}
        onAdd={handleAdd}
        onDelete={handleDelete}
        emptyLabel="No materials uploaded for this batch yet."
      />
    </div>
  );
}
