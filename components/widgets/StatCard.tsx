import type { ComponentType } from "react";
import type { DashboardStat, StatIconName } from "@/types/dashboard";
import type { IconProps } from "@/types/ui";
import { UserIcon } from "@/components/icons/UserIcon";
import { BookIcon } from "@/components/icons/BookIcon";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import { WalletIcon } from "@/components/icons/WalletIcon";
import { ClipboardIcon } from "@/components/icons/ClipboardIcon";
import { StarIcon } from "@/components/icons/StarIcon";

const STAT_ICONS: Record<StatIconName, ComponentType<IconProps>> = {
  user: UserIcon,
  book: BookIcon,
  calendar: CalendarIcon,
  wallet: WalletIcon,
  clipboard: ClipboardIcon,
  star: StarIcon,
};

interface StatCardProps {
  stat: DashboardStat;
}

export function StatCard({ stat }: StatCardProps) {
  const Icon = STAT_ICONS[stat.icon];

  return (
    <div className="rounded-[14px] border border-line bg-bg-elev p-5 shadow-[0_1px_2px_rgba(28,27,27,0.03)]">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-muted">
            {stat.label}
          </span>
          <span className="mt-2 font-display text-[28px] font-extrabold tracking-[-0.01em] text-ink">
            {stat.value}
          </span>
        </div>
        <span
          className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px]"
          style={{
            backgroundColor: `color-mix(in srgb, ${stat.accent} 14%, white)`,
            color: stat.accent,
          }}
        >
          <Icon size={16} />
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {stat.delta ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
              stat.deltaPositive
                ? "bg-[#ecfdf5] text-green"
                : "bg-[#fef2f2] text-red"
            }`}
          >
            {stat.deltaPositive ? "▲" : "▼"} {stat.delta}
          </span>
        ) : null}
        <span className="text-xs text-muted">{stat.sub}</span>
      </div>
    </div>
  );
}
