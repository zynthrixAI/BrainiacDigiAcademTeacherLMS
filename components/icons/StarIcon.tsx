import type { IconProps } from "@/types/ui";

export function StarIcon({ size = 20, color = "currentColor", className }: IconProps) {
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
      <path d="m12 3 2.6 5.7 6.4.8-4.8 4.4 1.3 6.4L12 17l-5.5 3.3 1.3-6.4L3 9.5l6.4-.8L12 3z" />
    </svg>
  );
}
