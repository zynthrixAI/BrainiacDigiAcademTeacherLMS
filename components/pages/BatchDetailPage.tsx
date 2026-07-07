"use client";

import { useState } from "react";
import Link from "next/link";
import { useBatches } from "@/hooks/query/useBatches";
import { LiveClassManager } from "@/components/widgets/LiveClassManager";
import { RecordingManager } from "@/components/widgets/RecordingManager";
import { AssignmentManager } from "@/components/widgets/AssignmentManager";
import { BatchMaterialsManager } from "@/components/widgets/BatchMaterialsManager";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { ROUTES } from "@/lib/constants";

type BatchTab = "live" | "recordings" | "assignments" | "materials";

const TABS: { value: BatchTab; label: string }[] = [
  { value: "live", label: "Live classes" },
  { value: "recordings", label: "Recordings" },
  { value: "assignments", label: "Assignments" },
  { value: "materials", label: "Materials" },
];

interface BatchDetailPageProps {
  batchId: string;
}

export function BatchDetailPage({ batchId }: BatchDetailPageProps) {
  const { data: batches } = useBatches();
  const batch = batches?.find((item) => item.id === batchId);

  const [tab, setTab] = useState<BatchTab>("live");

  return (
    <div className="mx-auto w-full max-w-[1100px]">
      <Link
        href={ROUTES.batches}
        className="text-xs font-semibold text-muted hover:text-ink"
      >
        ← All batches
      </Link>

      <div className="mt-3 mb-5 flex flex-col">
        <h1 className="m-0 font-display text-[26px] font-extrabold tracking-[-0.01em] text-ink">
          {batch?.name ?? "Batch"}
        </h1>
        <span className="mt-1 text-sm text-muted">
          {batch
            ? `${batch.subject_name} · ${batch.enrolled_count} students`
            : "Batch"}
        </span>
      </div>

      <div className="mb-5 overflow-x-auto">
        <SegmentedTabs options={TABS} value={tab} onChange={setTab} />
      </div>

      {tab === "live" ? <LiveClassManager batchId={batchId} /> : null}
      {tab === "recordings" ? <RecordingManager batchId={batchId} /> : null}
      {tab === "assignments" ? <AssignmentManager batchId={batchId} /> : null}
      {tab === "materials" ? <BatchMaterialsManager batchId={batchId} /> : null}
    </div>
  );
}
