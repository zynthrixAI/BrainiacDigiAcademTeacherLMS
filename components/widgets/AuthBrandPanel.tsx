import Image from "next/image";
import { LockIcon } from "@/components/icons/LockIcon";
import { AUTH_BRAND } from "@/lib/constants";

interface AuthBrandPanelProps {
  className?: string;
}

export function AuthBrandPanel({ className = "" }: AuthBrandPanelProps) {
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
            className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white p-2"
            style={{
              boxShadow: "0 6px 18px rgba(249,195,35,0.4)",
            }}
          >
            <Image
              src="/brand/brainiacs-mark.png"
              alt="Brainiacs"
              width={44}
              height={44}
              className="h-full w-full object-contain"
              priority
            />
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
        </div>

        <span className="mt-7 text-xs text-white/45">{AUTH_BRAND.copyright}</span>
      </div>
    </aside>
  );
}
