interface SegmentedTabsOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedTabsProps<T extends string> {
  options: SegmentedTabsOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
}: SegmentedTabsProps<T>) {
  return (
    <div className="inline-flex gap-1 rounded-xl bg-[#f0eeea] p-1">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-[9px] px-3.5 py-1.5 font-display text-[13px] font-semibold transition-colors ${
              active
                ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                : "text-muted hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
