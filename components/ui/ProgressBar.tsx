interface ProgressBarProps {
  /** Percentage, 0–100. */
  value: number;
  className?: string;
}

export function ProgressBar({ value, className = "" }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-line-2 ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span
        className="block h-full rounded-full bg-yellow"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
