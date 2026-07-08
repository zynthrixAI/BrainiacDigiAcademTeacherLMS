/**
 * A course option for the batch-course picker. Mirrors the subset of the
 * backend's `CourseResponse` (see app/schemas/course.py) a teacher needs to
 * pick a course for a batch.
 */
export interface CourseOption {
  id: string;
  subject_id: string;
  title: string;
}
