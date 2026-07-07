"use client";

import { useState } from "react";
import { useQuestions } from "@/hooks/query/useQuestions";
import { QuestionCard } from "@/components/widgets/QuestionCard";
import { FormError } from "@/components/ui/FormError";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { extractApiError } from "@/lib/utils/apiError";
import type { QuestionStatus } from "@/types/question";

type TabFilter = "all" | QuestionStatus;

const TAB_OPTIONS: { value: TabFilter; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "answered", label: "Answered" },
  { value: "all", label: "All" },
];

const EMPTY_MESSAGE: Record<TabFilter, string> = {
  pending: "No pending questions. You're all caught up.",
  answered: "You haven't answered any questions yet.",
  all: "No questions yet from your students.",
};

export function QuestionsPage() {
  const [tab, setTab] = useState<TabFilter>("pending");

  const requestStatus = tab === "all" ? undefined : tab;
  const { data, isLoading, isError, error } = useQuestions(requestStatus);

  const items = data?.items ?? [];

  return (
    <div className="mx-auto w-full max-w-[1100px]">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="m-0 font-display text-[26px] font-extrabold tracking-[-0.01em] text-ink">
            Questions
          </h1>
          <span className="mt-1 text-sm text-muted">
            Questions students have asked in subjects you teach.
          </span>
        </div>
      </div>

      <div className="mb-4 overflow-x-auto">
        <SegmentedTabs options={TAB_OPTIONS} value={tab} onChange={setTab} />
      </div>

      <div className="rounded-[14px] border border-line bg-bg-elev p-5 shadow-[0_1px_2px_rgba(28,27,27,0.03)]">
        {isLoading ? (
          <p className="py-12 text-center text-sm text-muted">
            Loading questions…
          </p>
        ) : isError ? (
          <FormError message={extractApiError(error)} />
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">
            {EMPTY_MESSAGE[tab]}
          </p>
        ) : (
          <div className="flex flex-col">
            {items.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
