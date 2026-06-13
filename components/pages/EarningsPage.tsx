import { StatCard } from "@/components/widgets/StatCard";
import { EarningsChart } from "@/components/widgets/EarningsChart";
import { PayoutRow } from "@/components/widgets/PayoutRow";
import { SectionCard } from "@/components/ui/SectionCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  EARNINGS_BREAKDOWN,
  EARNINGS_TREND,
  PAYOUTS,
} from "@/lib/data";
import type { DashboardStat } from "@/types/dashboard";

const paidOut = PAYOUTS.filter((p) => p.status === "processed").reduce(
  (sum, p) => sum + p.amount,
  0,
);
const pendingOut = PAYOUTS.filter((p) => p.status === "pending").reduce(
  (sum, p) => sum + p.amount,
  0,
);
const breakdownTotal = EARNINGS_BREAKDOWN.reduce((sum, b) => sum + b.amount, 0);

const rs = (value: number) => `Rs. ${value.toLocaleString()}`;

const STATS: DashboardStat[] = [
  {
    id: "total",
    label: "Total earned",
    value: rs(paidOut + pendingOut),
    sub: "this year",
    icon: "wallet",
    accent: "#1f8a5b",
  },
  {
    id: "month",
    label: "This month",
    value: rs(312000),
    delta: "9.4%",
    deltaPositive: true,
    sub: "vs May",
    icon: "calendar",
    accent: "#2a6fdb",
  },
  {
    id: "pending",
    label: "Pending payout",
    value: rs(pendingOut),
    sub: "due 5 Jul",
    icon: "clipboard",
    accent: "#ea580c",
  },
  {
    id: "paid",
    label: "Paid out (YTD)",
    value: rs(paidOut),
    sub: "across 3 payouts",
    icon: "star",
    accent: "#7e57c2",
  },
];

export function EarningsPage() {
  return (
    <div className="mx-auto w-full max-w-[1480px]">
      <div className="mb-5 flex flex-col">
        <h1 className="m-0 font-display text-[26px] font-extrabold tracking-[-0.01em] text-ink">
          Earnings
        </h1>
        <span className="mt-1 text-sm text-muted">
          Your 70% revenue share across all batches.
        </span>
      </div>

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
        {STATS.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <SectionCard
          title="Earnings trend"
          subtitle="Last 7 months (thousands of PKR)"
        >
          <EarningsChart data={EARNINGS_TREND} />
        </SectionCard>

        <SectionCard
          title="By subject"
          subtitle="This month's share"
        >
          <div className="flex flex-col gap-4">
            {EARNINGS_BREAKDOWN.map((item) => (
              <div key={item.subject} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink">{item.subject}</span>
                  <span className="font-display font-bold text-ink">
                    {rs(item.amount)}
                  </span>
                </div>
                <ProgressBar
                  value={breakdownTotal ? (item.amount / breakdownTotal) * 100 : 0}
                />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard title="Payouts" subtitle="Monthly payout history">
          <div className="flex flex-col">
            {PAYOUTS.map((payout) => (
              <PayoutRow key={payout.id} payout={payout} />
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
