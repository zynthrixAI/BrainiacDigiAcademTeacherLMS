import { StatCard } from "@/components/widgets/StatCard";
import { EarningsChart } from "@/components/widgets/EarningsChart";
import { LiveClassItem } from "@/components/widgets/LiveClassItem";
import { SubmissionItem } from "@/components/widgets/SubmissionItem";
import { SubjectCard } from "@/components/widgets/SubjectCard";
import { SectionCard } from "@/components/ui/SectionCard";
import {
  DASHBOARD_STATS,
  EARNINGS_TREND,
  RECENT_SUBMISSIONS,
  TEACHER_SUBJECTS,
  UPCOMING_CLASSES,
} from "@/lib/data";
import { ROUTES } from "@/lib/constants";

function SeeAllLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="whitespace-nowrap text-xs font-bold text-yellow-ink hover:underline"
    >
      See all →
    </a>
  );
}

export function TeacherDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1480px]">
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
        {DASHBOARD_STATS.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <SectionCard
          title="Earnings trend"
          subtitle="Last 7 months · your 70% revenue share"
        >
          <EarningsChart data={EARNINGS_TREND} />
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-4 sm:grid-cols-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted">Paid out (YTD)</span>
              <span className="font-display text-lg font-extrabold text-ink">
                Rs. 1.68M
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted">Next payout</span>
              <span className="font-display text-lg font-extrabold text-ink">
                Rs. 312k
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted">vs May</span>
              <span className="font-display text-lg font-extrabold text-green">
                +9.4%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted">Active batches</span>
              <span className="font-display text-lg font-extrabold text-ink">
                9
              </span>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Today's live classes"
          subtitle="3 classes · 1 live now"
          action={<SeeAllLink href={ROUTES.liveClasses} />}
        >
          <div className="flex flex-col gap-3.5">
            {UPCOMING_CLASSES.map((liveClass) => (
              <LiveClassItem key={liveClass.id} liveClass={liveClass} />
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <SectionCard
          title="Submissions to grade"
          subtitle="Latest student submissions"
          action={<SeeAllLink href={ROUTES.assignments} />}
        >
          <div className="flex flex-col gap-3.5">
            {RECENT_SUBMISSIONS.map((submission) => (
              <SubmissionItem key={submission.id} submission={submission} />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Your subjects"
          subtitle="Published and draft courses"
          action={<SeeAllLink href={ROUTES.subjects} />}
        >
          <div className="flex flex-col gap-2.5">
            {TEACHER_SUBJECTS.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
