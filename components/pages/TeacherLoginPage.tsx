import { TeacherLoginForm } from "@/components/forms/TeacherLoginForm";
import { EXTERNAL_PORTALS } from "@/lib/constants";

export function TeacherLoginPage() {
  return (
    <div>
      <h2 className="m-0 font-display text-[28px] font-extrabold tracking-[-0.01em] text-ink">
        Teacher sign in
      </h2>
      <p className="m-0 mt-2 text-sm leading-[1.55] text-muted">
        Use your BDA teacher credentials. Admins and students log in elsewhere.
      </p>

      <TeacherLoginForm />

      <div className="mt-6 flex items-center justify-center gap-2">
        <a
          href={EXTERNAL_PORTALS.admin}
          className="text-xs font-semibold text-muted hover:text-ink"
        >
          Admin portal
        </a>
        <span className="text-xs text-muted">·</span>
        <a
          href={EXTERNAL_PORTALS.student}
          className="text-xs font-semibold text-muted hover:text-ink"
        >
          Student portal
        </a>
      </div>
    </div>
  );
}
