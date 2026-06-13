import type { Payout, PayoutStatus } from "@/types/earning";

const STATUS_STYLES: Record<PayoutStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-soft text-yellow-ink" },
  processed: { label: "Processed", className: "bg-[#ecfdf5] text-green" },
};

interface PayoutRowProps {
  payout: Payout;
}

export function PayoutRow({ payout }: PayoutRowProps) {
  const status = STATUS_STYLES[payout.status];

  return (
    <div className="flex items-center justify-between gap-3 border-b border-line py-3.5 last:border-b-0">
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="text-[13.5px] font-bold text-ink">{payout.period}</span>
        <span className="truncate text-xs text-muted">
          {payout.students} students · {payout.date}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="font-display text-[15px] font-extrabold text-ink">
          Rs. {payout.amount.toLocaleString()}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${status.className}`}
        >
          {status.label}
        </span>
      </div>
    </div>
  );
}
