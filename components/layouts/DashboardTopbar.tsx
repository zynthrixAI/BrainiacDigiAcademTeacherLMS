"use client";

import { GridIcon } from "@/components/icons/GridIcon";
import { useTeacherProfile } from "@/hooks/query/useTeacherProfile";
import { getFirstName, getInitials } from "@/lib/utils/teacher";

interface DashboardTopbarProps {
  onMenuClick: () => void;
}

export function DashboardTopbar({ onMenuClick }: DashboardTopbarProps) {
  const { data: profile } = useTeacherProfile();
  const firstName = profile ? getFirstName(profile.name) : "Teacher";
  const initials = profile ? getInitials(profile.name) : "··";

  return (
    <header className="flex items-center justify-between gap-6 px-4 pt-5 sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-ink lg:hidden"
        >
          <GridIcon size={15} />
        </button>
        <div className="flex min-w-0 flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
            Teacher
          </span>
          <h2 className="m-0 font-display text-[22px] font-extrabold leading-tight text-ink">
            Welcome back, {firstName}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow font-display text-[13px] font-extrabold text-ink">
          {initials}
        </span>
      </div>
    </header>
  );
}
