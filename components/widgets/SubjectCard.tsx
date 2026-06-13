import type { Subject } from "@/types/subject";

interface SubjectCardProps {
  subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-[#faf9f7] p-3">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] font-display text-[11px] font-extrabold text-white"
        style={{ backgroundColor: subject.color }}
      >
        {subject.code}
      </span>

      <div className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="truncate text-[13px] font-bold text-ink">
          {subject.title}
        </span>
        <span className="text-xs text-muted">
          {subject.studentCount} students
        </span>
      </div>

      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
          subject.published
            ? "bg-[#ecfdf5] text-green"
            : "bg-[#f5f5f4] text-muted"
        }`}
      >
        {subject.published ? "Published" : "Draft"}
      </span>
    </div>
  );
}
