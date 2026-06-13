import type { ReactNode } from "react";
import { AuthBrandPanel } from "@/components/widgets/AuthBrandPanel";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen w-full bg-bg lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)]">
      <AuthBrandPanel className="hidden lg:flex" />
      <main className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[400px]">{children}</div>
      </main>
    </div>
  );
}
