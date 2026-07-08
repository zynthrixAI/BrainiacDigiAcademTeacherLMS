import type { ReactNode } from "react";
import Image from "next/image";
import { AuthBrandPanel } from "@/components/widgets/AuthBrandPanel";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen w-full bg-bg lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)]">
      <AuthBrandPanel className="hidden lg:flex" />
      <main className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile brand mark — visible only on small screens */}
          <div className="mb-7 lg:hidden">
            <Image
              src="/brand/brainiacs-logo.png"
              alt="Brainiacs Digital Academy"
              width={726}
              height={207}
              className="h-9 w-auto"
              priority
            />
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
