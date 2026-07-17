"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { usePreviewClasses } from "@/hooks/mutations/usePreviewClasses";
import { useGenerateClasses } from "@/hooks/mutations/useGenerateClasses";
import { extractApiError } from "@/lib/utils/apiError";
import { formatDateTime } from "@/lib/utils/datetime";
import type {
  PreviewSlot,
  Recurrence,
  RecurrenceFrequency,
} from "@/types/liveClass";

// Python's convention — 0 = Monday … 6 = Sunday — to match the backend exactly.
const DAYS = [
  { i: 0, label: "Mon" },
  { i: 1, label: "Tue" },
  { i: 2, label: "Wed" },
  { i: 3, label: "Thu" },
  { i: 4, label: "Fri" },
  { i: 5, label: "Sat" },
  { i: 6, label: "Sun" },
];

const FREQUENCY_OPTIONS: { value: RecurrenceFrequency; label: string }[] = [
  { value: "weekly", label: "Every week" },
  { value: "biweekly", label: "Every 2 weeks" },
];

// A small curated timezone list; the viewer's own zone is added if missing.
const BASE_TIMEZONES = [
  "Asia/Karachi",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Riyadh",
  "Europe/London",
  "America/New_York",
  "UTC",
];

const inputClass =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted-2 focus:border-yellow";
const labelClass = "font-display text-[12.5px] font-bold text-ink-2";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function todayLocalDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Karachi";
  } catch {
    return "Asia/Karachi";
  }
}

type Phase = "configure" | "review" | "done";

interface RecurringSchedulerProps {
  open: boolean;
  onClose: () => void;
  zoomConnected: boolean;
  /** Batch-scoped usage (e.g. a batch detail page) pins the batch. */
  fixedBatchId?: string;
  /** Global usage supplies the batch options for an in-modal picker. */
  batchOptions?: { value: string; label: string; sublabel?: string }[];
}

/**
 * Schedule a whole series of live classes for a batch — e.g. Mon/Wed/Fri from
 * a start date through the end of term. Drives the backend preview → generate
 * endpoints: the teacher sees every date (with conflicts flagged) before
 * anything is created. Meeting links are left empty on purpose — each class
 * auto-creates its own Zoom meeting ~15 min before it starts (or is added
 * manually later if Zoom isn't connected).
 *
 * The stateful body is a separate component mounted only while the modal is
 * open, so every open starts from a clean slate — no reset effect needed.
 */
export function RecurringScheduler({
  open,
  onClose,
  zoomConnected,
  fixedBatchId,
  batchOptions,
}: RecurringSchedulerProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Schedule a series of classes"
      widthClassName="max-w-lg"
    >
      <SchedulerBody
        onClose={onClose}
        zoomConnected={zoomConnected}
        fixedBatchId={fixedBatchId}
        batchOptions={batchOptions}
      />
    </Modal>
  );
}

type SchedulerBodyProps = Omit<RecurringSchedulerProps, "open">;

function SchedulerBody({
  onClose,
  zoomConnected,
  fixedBatchId,
  batchOptions,
}: SchedulerBodyProps) {
  // Captured once at mount (lazy initializers keep render pure).
  const [today] = useState(todayLocalDate);
  const [now] = useState(() => Date.now());

  const [phase, setPhase] = useState<Phase>("configure");
  const [pickedBatchId, setPickedBatchId] = useState("");
  const [title, setTitle] = useState("");
  const [days, setDays] = useState<number[]>([0, 2, 4]); // Mon/Wed/Fri default
  const [frequency, setFrequency] = useState<RecurrenceFrequency>("weekly");
  const [startTime, setStartTime] = useState("17:00");
  const [duration, setDuration] = useState("60");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [timezone, setTimezone] = useState(detectTimezone);
  const [localError, setLocalError] = useState<string | null>(null);

  const [slots, setSlots] = useState<PreviewSlot[]>([]);
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [createdCount, setCreatedCount] = useState(0);

  const previewMutation = usePreviewClasses();
  const generateMutation = useGenerateClasses();

  const batchId = fixedBatchId ?? pickedBatchId;

  const timezoneOptions = useMemo(() => {
    const set = new Set(BASE_TIMEZONES);
    set.add(detectTimezone());
    return Array.from(set);
  }, []);

  const toggleDay = (i: number) => {
    setDays((current) =>
      current.includes(i)
        ? current.filter((d) => d !== i)
        : [...current, i].sort((a, b) => a - b),
    );
  };

  const buildRecurrence = (): Recurrence => ({
    frequency,
    days_of_week: [...days].sort((a, b) => a - b),
    start_time: startTime,
    timezone,
    total_duration: Number(duration),
    // End-of-day so a class ON the end date is still included, not cut off.
    end_date: endDate ? new Date(`${endDate}T23:59:59`).toISOString() : null,
  });

  // A slot the teacher cannot schedule: it clashes with an existing class, or
  // it is already in the past. These are locked off (never sent to generate,
  // which would 409/422 the whole series).
  const isPast = (slot: PreviewSlot): boolean =>
    new Date(slot.scheduled_at).getTime() <= now;
  const isBlocked = (slot: PreviewSlot): boolean =>
    slot.conflicts_with !== null || isPast(slot);

  const selectedSlots = slots.filter(
    (slot) => !isBlocked(slot) && !excluded.has(slot.scheduled_at),
  );

  const handlePreview = () => {
    setLocalError(null);
    if (!batchId) {
      setLocalError("Pick a batch first.");
      return;
    }
    if (title.trim().length < 3) {
      setLocalError("Give the series a title (at least 3 characters).");
      return;
    }
    if (days.length === 0) {
      setLocalError("Pick at least one day of the week.");
      return;
    }
    if (!Number(duration) || Number(duration) < 5) {
      setLocalError("Duration must be at least 5 minutes.");
      return;
    }
    if (!startDate) {
      setLocalError("Pick a start date.");
      return;
    }
    if (endDate && endDate < startDate) {
      setLocalError("The end date can't be before the start date.");
      return;
    }

    previewMutation.mutate(
      {
        batchId,
        payload: {
          start_date: startDate,
          recurrence: buildRecurrence(),
          max_occurrences: 100,
        },
      },
      {
        onSuccess: (data) => {
          setSlots(data.slots);
          setExcluded(new Set());
          setPhase("review");
        },
      },
    );
  };

  const toggleSlot = (iso: string) => {
    setExcluded((current) => {
      const next = new Set(current);
      if (next.has(iso)) next.delete(iso);
      else next.add(iso);
      return next;
    });
  };

  const handleGenerate = () => {
    if (selectedSlots.length === 0) return;
    generateMutation.mutate(
      {
        batchId,
        payload: {
          title: title.trim(),
          total_duration: Number(duration),
          scheduled_ats: selectedSlots.map((slot) => slot.scheduled_at),
          // Links intentionally omitted — Zoom auto-creates one per class.
        },
      },
      {
        onSuccess: (data) => {
          setCreatedCount(data.total_created);
          setPhase("done");
        },
      },
    );
  };

  const blockedCount = slots.filter(isBlocked).length;

  if (phase === "done") {
    return (
      <div className="flex flex-col gap-4">
        <div
          role="status"
          className="rounded-[10px] border border-[#a7f3d0] bg-[#ecfdf5] p-4 text-sm font-semibold text-green"
        >
          Created {createdCount} {createdCount === 1 ? "class" : "classes"}.
          They&apos;re now on the schedule and students have been notified.
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    );
  }

  if (phase === "review") {
    return (
      <div className="flex flex-col gap-4">
        {slots.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">
            No dates match those days in that range. Go back and widen the day
            selection or the date range.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-ink">
                {selectedSlots.length}{" "}
                {selectedSlots.length === 1 ? "class" : "classes"} to create
              </span>
              {blockedCount > 0 ? (
                <span className="text-xs text-muted">
                  {blockedCount} skipped (conflict or in the past)
                </span>
              ) : null}
            </div>

            <div className="no-scrollbar max-h-[45vh] overflow-y-auto rounded-[10px] border border-line">
              {slots.map((slot) => {
                const blocked = isBlocked(slot);
                const past = slot.conflicts_with === null && isPast(slot);
                const checked = !blocked && !excluded.has(slot.scheduled_at);
                return (
                  <label
                    key={slot.scheduled_at}
                    className={`flex items-center gap-3 border-b border-line px-3 py-2.5 last:border-b-0 ${
                      blocked
                        ? "opacity-60"
                        : "cursor-pointer hover:bg-[#fafaf9]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={blocked}
                      onChange={() => toggleSlot(slot.scheduled_at)}
                      className="h-4 w-4 accent-yellow"
                    />
                    <span className="flex-1 text-sm text-ink">
                      {formatDateTime(slot.scheduled_at)}
                    </span>
                    {slot.conflicts_with ? (
                      <span className="rounded-full bg-[#fef3c7] px-2 py-0.5 text-[11px] font-bold text-[#92400e]">
                        Clashes with {slot.conflicts_with}
                      </span>
                    ) : past ? (
                      <span className="rounded-full bg-[#f4f4f5] px-2 py-0.5 text-[11px] font-bold text-muted">
                        Past
                      </span>
                    ) : null}
                  </label>
                );
              })}
            </div>
          </>
        )}

        {generateMutation.isError ? (
          <FormError message={extractApiError(generateMutation.error)} />
        ) : null}

        <div className="flex justify-between gap-2">
          <Button
            variant="ghost"
            onClick={() => setPhase("configure")}
            disabled={generateMutation.isPending}
          >
            Back
          </Button>
          <Button
            isLoading={generateMutation.isPending}
            disabled={selectedSlots.length === 0}
            onClick={handleGenerate}
          >
            Create {selectedSlots.length}{" "}
            {selectedSlots.length === 1 ? "class" : "classes"}
          </Button>
        </div>
      </div>
    );
  }

  // phase === "configure"
  return (
    <div className="flex flex-col gap-4">
      {!fixedBatchId ? (
        <SearchableSelect
          label="Batch"
          placeholder="Search batches…"
          options={batchOptions ?? []}
          value={pickedBatchId}
          onChange={setPickedBatchId}
        />
      ) : null}

      <div className="flex flex-col gap-2">
        <label htmlFor="series-title" className={labelClass}>
          Title
        </label>
        <input
          id="series-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Physics — Term 2"
          className={inputClass}
        />
        <span className="text-xs text-muted">
          Every class in the series shares this title.
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <span className={labelClass}>Days of the week</span>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => {
            const active = days.includes(day.i);
            return (
              <button
                key={day.i}
                type="button"
                onClick={() => toggleDay(day.i)}
                aria-pressed={active}
                className={`h-9 w-12 rounded-lg border text-sm font-semibold transition-colors ${
                  active
                    ? "border-yellow bg-yellow text-ink"
                    : "border-line bg-white text-muted hover:border-yellow"
                }`}
              >
                {day.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className={labelClass}>Repeats</span>
        <SegmentedTabs
          options={FREQUENCY_OPTIONS}
          value={frequency}
          onChange={setFrequency}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="series-time" className={labelClass}>
            Start time
          </label>
          <input
            id="series-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="series-duration" className={labelClass}>
            Duration (min)
          </label>
          <input
            id="series-duration"
            type="number"
            inputMode="numeric"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="60"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="series-start" className={labelClass}>
            Starts on
          </label>
          <input
            id="series-start"
            type="date"
            value={startDate}
            min={today}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="series-end" className={labelClass}>
            Ends on (optional)
          </label>
          <input
            id="series-end"
            type="date"
            value={endDate}
            min={startDate || today}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="series-tz" className={labelClass}>
          Timezone
        </label>
        <select
          id="series-tz"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className={inputClass}
        >
          {timezoneOptions.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      <p className="m-0 rounded-[10px] border border-line bg-[#fafaf9] p-3 text-xs text-muted">
        {zoomConnected
          ? "Each class gets its own Zoom meeting automatically ~15 minutes before it starts — no links to paste."
          : "Zoom isn't connected, so classes are created without a meeting link. Connect Zoom (Settings → Integrations) or add links to each class later."}
      </p>

      <FormError message={localError ?? undefined} />
      {previewMutation.isError ? (
        <FormError message={extractApiError(previewMutation.error)} />
      ) : null}

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button isLoading={previewMutation.isPending} onClick={handlePreview}>
          Preview dates
        </Button>
      </div>
    </div>
  );
}
