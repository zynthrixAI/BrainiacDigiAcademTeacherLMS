/** BatchResponse from the teacher batches API. */
export interface Batch {
  id: string;
  subject_id: string;
  subject_name: string;
  course_id: string | null;
  course_title: string | null;
  name: string;
  description: string;
  teacher_id: string | null;
  teacher_name: string | null;
  thumbnail_url: string | null;
  price: number;
  enrolled_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
