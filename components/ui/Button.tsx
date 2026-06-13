import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { ButtonVariant } from "@/types/ui";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-yellow text-ink hover:bg-[#f5b900]",
  ghost: "bg-transparent text-ink border-line-2 hover:bg-[#fafaf9]",
  dark: "bg-ink text-white hover:bg-black",
  danger: "bg-red text-white hover:brightness-95",
};

export function Button({
  variant = "primary",
  isLoading = false,
  disabled,
  children,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-transparent px-4 py-2.5 font-display text-[13px] font-bold transition-all duration-150 ease-out cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
