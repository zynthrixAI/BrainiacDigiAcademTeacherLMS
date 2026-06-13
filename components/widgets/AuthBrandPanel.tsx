import { LockIcon } from "@/components/icons/LockIcon";
import { AUTH_BRAND, AUTH_STATS } from "@/lib/constants";
import type { AuthStat } from "@/lib/constants";

interface AuthBrandPanelProps {
  className?: string;
  stats?: AuthStat[];
}

export function AuthBrandPanel({
  className = "",
  stats = AUTH_STATS,
}: AuthBrandPanelProps) {
  return (
    <aside
      className={`relative flex flex-col overflow-hidden p-12 text-white ${className}`}
      style={{ background: "linear-gradient(160deg, #1c1b1b 0%, #2a2926 100%)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-32 h-[460px] w-[460px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(249,195,35,0.22) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex h-full max-w-[520px] flex-col justify-between">
        <div className="flex items-center gap-3">
          <div
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl font-display text-xl font-extrabold text-ink"
            style={{
              background: "var(--yellow)",
              boxShadow: "0 6px 18px rgba(249,195,35,0.4)",
            }}
          >
            {AUTH_BRAND.initial}
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl font-extrabold">
              {AUTH_BRAND.name}
            </span>
            <span className="mt-1 text-[11px] uppercase tracking-[0.08em] text-sidebar-muted">
              {AUTH_BRAND.subtitle}
            </span>
          </div>
        </div>

        <div className="mt-[6vh]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(249,195,35,0.16)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-yellow">
            <LockIcon size={11} />
            {AUTH_BRAND.badge}
          </span>

          <h1 className="my-5 font-display text-[clamp(28px,3.4vw,44px)] font-extrabold leading-[1.08] tracking-[-0.02em] text-balance">
            {AUTH_BRAND.headlineLead}{" "}
            <span className="text-yellow">{AUTH_BRAND.headlineAccent}</span>
          </h1>

          <p className="m-0 max-w-[460px] text-[14.5px] leading-[1.65] text-white/65">
            {AUTH_BRAND.description}
          </p>

          <div className="mt-9 grid grid-cols-3 gap-9">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-[22px] font-extrabold text-yellow">
                  {stat.value}
                </div>
                <div className="text-xs text-white/55">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <span className="mt-7 text-xs text-white/45">{AUTH_BRAND.copyright}</span>
      </div>
    </aside>
  );
}
