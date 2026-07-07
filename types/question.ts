export type QuestionStatus = "pending" | "answered";

export interface QuestionContext {
  course_id?: string;
  course_title?: string;
  lesson_id?: string;
  lesson_title?: string;
  video_timestamp?: number;
  chat_session_id?: string;
}

/** QuestionResponse from the teacher questions API. */
export interface Question {
  id: string;
  user_id: string;
  user_name: string;
  subject_id: string;
  subject_name: string;
  question: string;
  context: QuestionContext | null;
  status: QuestionStatus;
  answer: string | null;
  answered_by: string | null;
  answered_by_name: string | null;
  answered_at: string | null;
  created_at: string;
  updated_at: string;
}
