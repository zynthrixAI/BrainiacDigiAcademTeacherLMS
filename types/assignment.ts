export type AssignmentStatus = "active" | "closed";

export interface RubricCriterion {
  criterion: string;
  max_marks: number;
}

/** AssignmentResponse from the teacher assignments API. */
export interface Assignment {
  id: string;
  teacher_id: string;
  subject_id: string;
  batch_id: string;
  title: string;
  instructions: string;
  file_url: string | null;
  deadline: string;
  allow_resubmission: boolean;
  rubric: RubricCriterion[];
  total_marks: number;
  status: AssignmentStatus;
  created_at: string;
  updated_at: string;
}

/** Local form values for the create/edit assignment form (file handled separately). */
export interface AssignmentFormValues {
  title: string;
  instructions: string;
  deadline: string;
  allow_resubmission: boolean;
  status: AssignmentStatus;
}

/** Editable rubric row — marks kept as a string while typing. */
export interface RubricFormRow {
  criterion: string;
  max_marks: string;
}
