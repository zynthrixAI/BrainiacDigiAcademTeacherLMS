import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  subtitle,
  action,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section
      className={`rounded-[14px] border border-line bg-bg-elev p-5 shadow-[0_1px_2px_rgba(28,27,27,0.03)] ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <h3 className="m-0 font-display text-[15px] font-bold text-ink">
            {title}
          </h3>
          {subtitle ? (
            <span className="mt-0.5 text-xs text-muted">{subtitle}</span>
          ) : null}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
