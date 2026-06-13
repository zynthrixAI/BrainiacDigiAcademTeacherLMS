"use client";

import { useState } from "react";
import Link from "next/link";
import { useAssignment } from "@/hooks/query/useAssignment";
import { useSubmissions } from "@/hooks/query/useSubmissions";
import { SubmissionRow } from "@/components/widgets/SubmissionRow";
import { SubmissionGradeModal } from "@/components/widgets/SubmissionGradeModal";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { FormError } from "@/components/ui/FormError";
import { extractApiError } from "@/lib/utils/apiError";
import { getGradeState } from "@/lib/utils/submission";
import { ROUTES } from "@/lib/constants";
import type { Submission } from "@/types/submission";

type Filter = "all" | "ungraded" | "draft" | "released";

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ungraded", label: "Ungraded" },
  { value: "draft", label: "Draft" },
  { value: "released", label: "Released" },
];

interface AssignmentSubmissionsPageProps {
  assignmentId: string;
}

export function AssignmentSubmissionsPage({
  assignmentId,
}: AssignmentSubmissionsPageProps) {
  const { data: assignment } = useAssignment(assignmentId);
  const { data: submissions, isLoading, isError, error } =
    useSubmissions(assignmentId);

  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Submission | null>(null);

  const items = (submissions ?? []).filter(
    (submission) => filter === "all" || getGradeState(submission) === filter,
  );

  return (
    <div className="mx-auto w-full max-w-[1100px]">
      <Link
        href={ROUTES.assignments}
        className="text-xs font-semibold text-muted hover:text-ink"
      >
        ← Assignments
      </Link>

      <div className="mt-3 mb-5 flex flex-col">
        <h1 className="m-0 font-display text-[26px] font-extrabold tracking-[-0.01em] text-ink">
          {assignment?.title ?? "Submissions"}
        </h1>
        <span className="mt-1 text-sm text-muted">
          {assignment
            ? `${assignment.total_marks} marks · ${submissions?.length ?? 0} submissions`
            : "Student submissions"}
        </span>
      </div>

      <div className="mb-4 overflow-x-auto">
        <SegmentedTabs
          options={FILTER_OPTIONS}
          value={filter}
          onChange={setFilter}
        />
      </div>

      <div className="rounded-[14px] border border-line bg-bg-elev p-5 shadow-[0_1px_2px_rgba(28,27,27,0.03)]">
        {isLoading ? (
          <p className="py-12 text-center text-sm text-muted">
            Loading submissions…
          </p>
        ) : isError ? (
          <FormError message={extractApiError(error)} />
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">
            No submissions{filter !== "all" ? " in this state" : " yet"}.
          </p>
        ) : (
          <div className="flex flex-col">
            {items.map((submission) => (
              <SubmissionRow
                key={submission.id}
                submission={submission}
                totalMarks={assignment?.total_marks ?? 0}
                onReview={setSelected}
              />
            ))}
          </div>
        )}
      </div>

      {selected ? (
        <SubmissionGradeModal
          key={selected.id}
          submission={selected}
          rubric={assignment?.rubric ?? []}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </div>
  );
}
