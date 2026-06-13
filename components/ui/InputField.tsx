"use client";

import type { ReactNode } from "react";
import { useField } from "formik";

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  icon?: ReactNode;
  labelAccessory?: ReactNode;
  inputMode?: "text" | "numeric" | "email" | "tel" | "search" | "url";
  maxLength?: number;
}

export function InputField({
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  icon,
  labelAccessory,
  inputMode,
  maxLength,
}: InputFieldProps) {
  const [field, meta] = useField(name);
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className="font-display text-[12.5px] font-bold text-ink-2"
        >
          {label}
        </label>
        {labelAccessory}
      </div>

      <div
        className={`flex items-center gap-2 rounded-xl border bg-white px-3.5 py-2.5 transition-colors focus-within:border-yellow ${
          hasError ? "border-red" : "border-line"
        }`}
      >
        {icon ? <span className="text-muted">{icon}</span> : null}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={hasError}
          className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted-2"
          {...field}
        />
      </div>

      {hasError ? (
        <span role="alert" className="text-xs text-red">
          {meta.error}
        </span>
      ) : null}
    </div>
  );
}
