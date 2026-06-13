"use client";

import { useMemo, useState } from "react";

export interface SearchableOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface SearchableSelectProps {
  label?: string;
  placeholder?: string;
  options: SearchableOption[];
  value: string;
  onChange: (value: string) => void;
}

export function SearchableSelect({
  label,
  placeholder = "Search…",
  options,
  value,
  onChange,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = options.find((option) => option.value === value);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(normalized) ||
        (option.sublabel?.toLowerCase().includes(normalized) ?? false),
    );
  }, [options, query]);

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <span className="font-display text-[12.5px] font-bold text-ink-2">
          {label}
        </span>
      ) : null}

      <div className="relative">
        <input
          value={open ? query : (selected?.label ?? "")}
          placeholder={placeholder}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted-2 focus:border-yellow"
        />

        {open ? (
          <ul className="no-scrollbar absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-line bg-bg-elev p-1 shadow-[0_12px_30px_rgba(0,0,0,0.15)]">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted">No matches</li>
            ) : (
              filtered.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`flex w-full flex-col rounded-lg px-3 py-2 text-left transition-colors hover:bg-[#faf9f7] ${
                      option.value === value ? "bg-yellow-soft" : ""
                    }`}
                  >
                    <span className="text-sm font-semibold text-ink">
                      {option.label}
                    </span>
                    {option.sublabel ? (
                      <span className="text-xs text-muted">
                        {option.sublabel}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
