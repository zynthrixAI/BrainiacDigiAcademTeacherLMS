import type { IconProps } from "@/types/ui";

export function QuestionIcon({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4.9-.75c.2.66-.1 1.2-.6 1.6l-.6.5c-.5.42-.7.85-.7 1.4" />
      <line x1="12" y1="16.5" x2="12" y2="16.51" />
    </svg>
  );
}
