"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { useAnswerQuestion } from "@/hooks/mutations/useAnswerQuestion";
import { extractApiError } from "@/lib/utils/apiError";
import { formatDateTime } from "@/lib/utils/datetime";
import { formatQuestionContext } from "@/lib/utils/question";
import type { Question } from "@/types/question";

interface QuestionCardProps {
  question: Question;
  onAnswered?: () => void;
}

export function QuestionCard({ question, onAnswered }: QuestionCardProps) {
  const [answer, setAnswer] = useState("");
  const [justAnswered, setJustAnswered] = useState(false);
  const answerMutation = useAnswerQuestion();

  const contextLine = formatQuestionContext(question.context);
  const isPending = question.status === "pending";

  const handleSubmit = () => {
    if (!answer.trim()) return;
    answerMutation.mutate(
      { id: question.id, answer: answer.trim() },
      {
        onSuccess: () => {
          setJustAnswered(true);
          setAnswer("");
          onAnswered?.();
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-3 border-b border-line px-1 py-4 last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-[14px] font-bold text-ink">
              {question.user_name}
            </span>
            <span className="inline-flex items-center rounded-full bg-[#eef2ff] px-2 py-0.5 text-[11px] font-bold text-blue">
              {question.subject_name}
            </span>
          </div>
          {contextLine ? (
            <span className="text-xs text-muted">{contextLine}</span>
          ) : null}
        </div>
        <span className="shrink-0 text-xs text-muted-2">
          {formatDateTime(question.created_at)}
        </span>
      </div>

      <p className="m-0 whitespace-pre-wrap text-sm text-ink-2">
        {question.question}
      </p>

      {isPending ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value);
              setJustAnswered(false);
            }}
            rows={3}
            placeholder="Write an answer for the student…"
            className="w-full resize-y rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none placeholder:text-muted-2 focus:border-yellow"
          />
          <FormError
            message={
              answerMutation.isError
                ? extractApiError(answerMutation.error)
                : undefined
            }
          />
          <div className="flex items-center justify-end">
            <Button
              className="px-4 py-1.5 text-xs"
              isLoading={answerMutation.isPending}
              disabled={!answer.trim()}
              onClick={handleSubmit}
            >
              Submit answer
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5 rounded-xl border border-line bg-[#faf9f7] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-display text-[12.5px] font-bold text-ink-2">
              Your answer
            </span>
            {question.answered_at ? (
              <span className="text-xs text-muted-2">
                Answered {formatDateTime(question.answered_at)}
                {question.answered_by_name ? ` · ${question.answered_by_name}` : ""}
              </span>
            ) : null}
          </div>
          <p className="m-0 whitespace-pre-wrap text-sm text-ink-2">
            {question.answer}
          </p>
        </div>
      )}

      {justAnswered ? (
        <span className="text-xs font-semibold text-green">
          Answer submitted.
        </span>
      ) : null}
    </div>
  );
}
