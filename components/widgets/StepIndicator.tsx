import { CheckIcon } from "@/components/icons/CheckIcon";

interface StepIndicatorProps {
  steps: string[];
  /** Zero-based index of the active step. */
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-display text-[11px] font-bold ${
                isCompleted
                  ? "bg-yellow text-ink"
                  : isActive
                    ? "bg-ink text-white"
                    : "bg-line-2 text-muted"
              }`}
            >
              {isCompleted ? <CheckIcon size={12} /> : index + 1}
            </span>
            <span
              className={`text-xs font-semibold ${
                isActive || isCompleted ? "text-ink" : "text-muted-2"
              }`}
            >
              {label}
            </span>
            {index < steps.length - 1 ? (
              <span className="h-px w-5 bg-line-2" aria-hidden="true" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
