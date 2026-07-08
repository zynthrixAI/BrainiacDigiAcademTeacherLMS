"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayersIcon } from "@/components/icons/LayersIcon";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import { PlayIcon } from "@/components/icons/PlayIcon";
import { ClipboardIcon } from "@/components/icons/ClipboardIcon";
import { QuestionIcon } from "@/components/icons/QuestionIcon";
import { LogoutIcon } from "@/components/icons/LogoutIcon";
import { useTeacherLogout } from "@/hooks/mutations/useTeacherLogout";
import { useTeacherProfile } from "@/hooks/query/useTeacherProfile";
import { useQuestions } from "@/hooks/query/useQuestions";
import { getInitials, getTeacherRole } from "@/lib/utils/teacher";
import { ROUTES } from "@/lib/constants";
import type { NavSection } from "@/types/navigation";

function useNavSections(pendingQuestions?: number): NavSection[] {
  return [
    {
      section: "Teaching",
      items: [
        { label: "My batches", href: ROUTES.batches, icon: LayersIcon },
        { label: "Live classes", href: ROUTES.liveClasses, icon: CalendarIcon },
        { label: "Recordings", href: ROUTES.recordings, icon: PlayIcon },
        { label: "Assignments", href: ROUTES.assignments, icon: ClipboardIcon },
        {
          label: "Questions",
          href: ROUTES.questions,
          icon: QuestionIcon,
          badge: pendingQuestions,
        },
      ],
    },
  ];
}

interface DashboardSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ mobileOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useTeacherLogout();
  const { data: profile, isLoading } = useTeacherProfile();
  const { data: pendingQuestions } = useQuestions("pending");
  const navSections = useNavSections(pendingQuestions?.total);

  const displayName = profile?.name ?? (isLoading ? "Loading…" : "Teacher");
  const initials = profile ? getInitials(profile.name) : "··";
  const role = profile ? getTeacherRole(profile.level) : "Brainiacs Teacher";

  const handleSignOut = () => {
    logout.mutate(undefined, {
      onSuccess: () => router.push(ROUTES.login),
    });
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside
      className={`no-scrollbar fixed inset-y-0 left-0 z-50 flex h-screen w-[252px] flex-col gap-2 overflow-y-auto bg-sidebar-bg p-[14px] transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:self-start ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center gap-3 px-2 pb-3.5 pt-1">
        <span className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[10px] bg-white p-1.5 shadow-[0_4px_14px_rgba(249,195,35,0.35)]">
          <Image
            src="/brand/brainiacs-mark.png"
            alt="Brainiacs"
            width={38}
            height={38}
            className="h-full w-full object-contain"
            priority
          />
        </span>
        <div className="flex flex-col leading-none">
          <span className="font-display text-sm font-extrabold tracking-[0.02em] text-white">
            Brainiacs
          </span>
          <span className="mt-1 text-[9.5px] uppercase tracking-[0.1em] text-sidebar-muted">
            Teacher Portal
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5">
        {navSections.map((group) => (
          <div key={group.section} className="flex flex-col gap-0.5">
            <span className="px-3 pb-1 pt-3 text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-[#5b5955]">
              {group.section}
            </span>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-[10px] px-3 py-[9px] font-display text-[13px] transition-colors ${
                    active
                      ? "bg-yellow font-bold text-ink"
                      : "font-medium text-[#dcdad4] hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span
                      className={`inline-flex min-w-[18px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-extrabold leading-none ${
                        active
                          ? "bg-ink text-yellow"
                          : "bg-yellow text-ink"
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/5 pt-3">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-yellow/20 font-display text-[11px] font-extrabold text-yellow">
            {initials}
          </span>
          <div className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate text-[12.5px] font-bold text-white">
              {displayName}
            </span>
            <span className="truncate text-[10.5px] text-sidebar-muted">
              {role}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={logout.isPending}
          className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 font-display text-[12.5px] font-semibold text-[#bdbab2] transition-colors hover:bg-white/5 disabled:opacity-60"
        >
          <LogoutIcon size={14} />
          <span>{logout.isPending ? "Signing out…" : "Sign out"}</span>
        </button>
      </div>
    </aside>
  );
}
