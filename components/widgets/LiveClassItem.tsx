import type { UpcomingClass } from "@/types/dashboard";

interface LiveClassItemProps {
  liveClass: UpcomingClass;
}

export function LiveClassItem({ liveClass }: LiveClassItemProps) {
  const isLive = liveClass.status === "live";

  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg font-display text-[10px] font-extrabold text-white"
        style={{ backgroundColor: liveClass.color }}
      >
        {liveClass.subjectCode}
      </span>

      <div className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="truncate text-[13px] font-bold text-ink">
          {liveClass.title}
        </span>
        <span className="truncate text-xs text-muted">
          {liveClass.batch} · {liveClass.durationMins} min
        </span>
      </div>

      {isLive ? (
        <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#fef2f2] px-2 py-0.5 text-[11px] font-bold text-red">
          ● Live
        </span>
      ) : (
        <span className="whitespace-nowrap text-xs font-semibold text-muted">
          {liveClass.when}
        </span>
      )}
    </div>
  );
}
