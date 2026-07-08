import { TeacherLoginForm } from "@/components/forms/TeacherLoginForm";

export function TeacherLoginPage() {
  return (
    <div>
      <h2 className="m-0 font-display text-[28px] font-extrabold tracking-[-0.01em] text-ink">
        Teacher sign in
      </h2>
      <p className="m-0 mt-2 text-sm leading-[1.55] text-muted">
        Use your Brainiacs teacher credentials. Admins and students log in elsewhere.
      </p>

      <TeacherLoginForm />
    </div>
  );
}
