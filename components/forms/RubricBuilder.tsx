"use client";

import { CloseIcon } from "@/components/icons/CloseIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import type { RubricFormRow } from "@/types/assignment";

interface RubricBuilderProps {
  rows: RubricFormRow[];
  onChange: (rows: RubricFormRow[]) => void;
}

export function RubricBuilder({ rows, onChange }: RubricBuilderProps) {
  const total = rows.reduce((sum, row) => sum + (Number(row.max_marks) || 0), 0);

  const updateRow = (index: number, patch: Partial<RubricFormRow>) => {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const removeRow = (index: number) => {
    onChange(rows.filter((_, i) => i !== index));
  };

  const addRow = () => {
    onChange([...rows, { criterion: "", max_marks: "10" }]);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-display text-[12.5px] font-bold text-ink-2">
          Grading rubric
        </span>
        <span className="inline-flex items-center rounded-full bg-yellow-soft px-2.5 py-0.5 text-[11px] font-bold text-yellow-ink">
          {total} {total === 1 ? "mark" : "marks"} total
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line-2 bg-[#faf9f7] p-4 text-center text-xs text-muted">
          No criteria yet. Add at least one so students know how they&apos;re
          graded.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((row, index) => (
            <li
              key={index}
              className="flex items-center gap-2 rounded-xl border border-line bg-white p-2"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f5f5f4] font-display text-[11px] font-bold text-muted">
                {index + 1}
              </span>
              <input
                value={row.criterion}
                onChange={(event) =>
                  updateRow(index, { criterion: event.target.value })
                }
                placeholder="e.g. Accuracy of results"
                aria-label={`Criterion ${index + 1} name`}
                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted-2"
              />
              <div className="flex shrink-0 items-center gap-1 rounded-lg bg-[#faf9f7] px-2 py-1.5">
                <input
                  value={row.max_marks}
                  onChange={(event) =>
                    updateRow(index, {
                      max_marks: event.target.value.replace(/[^0-9]/g, ""),
                    })
                  }
                  inputMode="numeric"
                  placeholder="10"
                  aria-label={`Criterion ${index + 1} max marks`}
                  className="w-9 border-0 bg-transparent text-right text-sm font-semibold text-ink outline-none"
                />
                <span className="text-[11px] text-muted">pts</span>
              </div>
              <button
                type="button"
                onClick={() => removeRow(index)}
                aria-label={`Remove criterion ${index + 1}`}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-[#fef2f2] hover:text-red"
              >
                <CloseIcon size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={addRow}
        className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-line-2 px-3 py-2 font-display text-xs font-bold text-yellow-ink transition-colors hover:bg-yellow-soft"
      >
        <PlusIcon size={14} /> Add criterion
      </button>
    </div>
  );
}
