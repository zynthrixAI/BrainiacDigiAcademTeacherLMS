import type { CourseOption } from "@/types/course";

/**
 * STUB — no teacher-facing "list courses by subject" endpoint exists on the
 * backend yet. The only course-listing routes today are
 * `GET /api/admins/.../` and `GET /api/users/courses/` (see
 * app/api/admins/course.py and app/api/users/course.py), neither reachable
 * with a teacher token.
 *
 * Once the backend ships a teacher route (e.g.
 * `GET /api/teachers/courses/?subject_id=...`), replace the body below with a
 * real axios call mirroring `getBatches` in `./batches.ts` — the call site
 * (`useCoursesBySubject`) will not need to change beyond removing its
 * `enabled: false` guard.
 */
export async function listCoursesBySubject(
  _accessToken: string,
  _subjectId: string,
): Promise<CourseOption[]> {
  throw new Error(
    "No teacher-facing course-listing endpoint exists yet — wire this up once the backend ships one.",
  );
}
