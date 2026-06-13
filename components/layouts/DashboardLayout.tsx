"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardTopbar } from "@/components/layouts/DashboardTopbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg lg:grid lg:grid-cols-[252px_1fr]">
      <DashboardSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      ) : null}

      <div className="flex min-h-screen flex-col">
        <DashboardTopbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 pb-24 pt-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
