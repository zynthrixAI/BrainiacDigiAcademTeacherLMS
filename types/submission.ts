export type SubmissionStatus = "submitted" | "graded";

export type SubmissionFileType = "pdf" | "jpeg" | "png";

export interface SubmissionFile {
  s3_key: string;
  file_name: string;
  file_type: SubmissionFileType;
}

export interface RubricScore {
  criterion: string;
  marks_awarded: number;
  feedback: string;
}

export interface Grade {
  rubric_scores: RubricScore[];
  total_marks: number;
  overall_feedback: string;
  released_at: string | null;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  files: SubmissionFile[];
  submission_number: number;
  submitted_at: string;
  is_late: boolean;
  status: SubmissionStatus;
  grade: Grade | null;
}

export interface GradeRequest {
  rubric_scores: {
    criterion: string;
    marks_awarded: number;
    feedback: string;
  }[];
  overall_feedback: string;
}

/** Editable per-criterion grade row — marks kept as a string while typing. */
export interface GradeFormScore {
  marks_awarded: string;
  feedback: string;
}
