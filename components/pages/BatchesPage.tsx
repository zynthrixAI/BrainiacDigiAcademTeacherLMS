"use client";

import { useBatches } from "@/hooks/query/useBatches";
import { BatchCard } from "@/components/widgets/BatchCard";
import { FormError } from "@/components/ui/FormError";
import { extractApiError } from "@/lib/utils/apiError";

export function BatchesPage() {
  const { data: batches, isLoading, isError, error } = useBatches();

  return (
    <div className="mx-auto w-full max-w-[1480px]">
      <div className="mb-5 flex flex-col">
        <h1 className="m-0 font-display text-[26px] font-extrabold tracking-[-0.01em] text-ink">
          My batches
        </h1>
        <span className="mt-1 text-sm text-muted">
          Batches assigned to you by the admin. Run their live classes here.
        </span>
      </div>

      {isLoading ? (
        <p className="py-16 text-center text-sm text-muted">Loading batches…</p>
      ) : isError ? (
        <FormError message={extractApiError(error)} />
      ) : !batches || batches.length === 0 ? (
        <div className="rounded-[14px] border border-line bg-bg-elev p-12 text-center text-sm text-muted">
          You have no batches assigned yet. An admin assigns batches to you.
        </div>
      ) : (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
          {batches.map((batch) => (
            <BatchCard key={batch.id} batch={batch} />
          ))}
        </div>
      )}
    </div>
  );
}
