"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import type { RubricCriterion } from "@/types/assignment";
import type { Grade, GradeFormScore, GradeRequest } from "@/types/submission";

interface GradeFormProps {
  rubric: RubricCriterion[];
  grade: Grade | null;
  saving: boolean;
  errorMessage?: string;
  onSave: (body: GradeRequest) => Promise<void> | void;
}

function buildInitialScores(
  rubric: RubricCriterion[],
  grade: Grade | null,
): Record<string, GradeFormScore> {
  const scores: Record<string, GradeFormScore> = {};
  rubric.forEach((criterion) => {
    const existing = grade?.rubric_scores.find(
      (score) => score.criterion === criterion.criterion,
    );
    scores[criterion.criterion] = {
      marks_awarded: existing ? String(existing.marks_awarded) : "",
      feedback: existing?.feedback ?? "",
    };
  });
  return scores;
}

export function GradeForm({
  rubric,
  grade,
  saving,
  errorMessage,
  onSave,
}: GradeFormProps) {
  const [scores, setScores] = useState<Record<string, GradeFormScore>>(() =>
    buildInitialScores(rubric, grade),
  );
  const [overall, setOverall] = useState(grade?.overall_feedback ?? "");

  const maxTotal = rubric.reduce((sum, c) => sum + c.max_marks, 0);
  const total = rubric.reduce(
    (sum, c) => sum + (Number(scores[c.criterion]?.marks_awarded) || 0),
    0,
  );

  const updateScore = (criterion: string, patch: Partial<GradeFormScore>) => {
    setScores((current) => ({
      ...current,
      [criterion]: { ...current[criterion], ...patch },
    }));
  };

  const handleSave = () => {
    onSave({
      rubric_scores: rubric.map((c) => ({
        criterion: c.criterion,
        marks_awarded: Number(scores[c.criterion]?.marks_awarded) || 0,
        feedback: scores[c.criterion]?.feedback ?? "",
      })),
      overall_feedback: overall.trim(),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-display text-[12.5px] font-bold text-ink-2">
          Rubric
        </span>
        <span className="inline-flex items-center rounded-full bg-yellow-soft px-2.5 py-0.5 text-[11px] font-bold text-yellow-ink">
          {total} / {maxTotal} marks
        </span>
      </div>

      <ul className="flex flex-col gap-3">
        {rubric.map((criterion) => (
          <li
            key={criterion.criterion}
            className="flex flex-col gap-2 rounded-xl border border-line bg-white p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-ink">
                {criterion.criterion}
              </span>
              <div className="flex shrink-0 items-center gap-1 rounded-lg bg-[#faf9f7] px-2 py-1.5">
                <input
                  value={scores[criterion.criterion]?.marks_awarded ?? ""}
                  onChange={(event) =>
                    updateScore(criterion.criterion, {
                      marks_awarded: event.target.value.replace(/[^0-9]/g, ""),
                    })
                  }
                  inputMode="numeric"
                  placeholder="0"
                  aria-label={`Marks for ${criterion.criterion}`}
                  className="w-9 border-0 bg-transparent text-right text-sm font-semibold text-ink outline-none"
                />
                <span className="text-[11px] text-muted">
                  / {criterion.max_marks}
                </span>
              </div>
            </div>
            <input
              value={scores[criterion.criterion]?.feedback ?? ""}
              onChange={(event) =>
                updateScore(criterion.criterion, { feedback: event.target.value })
              }
              placeholder="Feedback (optional)"
              aria-label={`Feedback for ${criterion.criterion}`}
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none placeholder:text-muted-2 focus:border-yellow"
            />
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="overall_feedback"
          className="font-display text-[12.5px] font-bold text-ink-2"
        >
          Overall feedback
        </label>
        <textarea
          id="overall_feedback"
          value={overall}
          onChange={(event) => setOverall(event.target.value)}
          rows={3}
          placeholder="Summary feedback for the student"
          className="w-full resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted-2 focus:border-yellow"
        />
      </div>

      <FormError message={errorMessage} />

      <Button
        type="button"
        variant="ghost"
        isLoading={saving}
        onClick={handleSave}
        className="w-full"
      >
        {saving ? "Saving…" : "Save grade (draft)"}
      </Button>
    </div>
  );
}
