export type RecordingStatus =
  | "processing"
  | "draft"
  | "pending_edit"
  | "published";

/** RecordingResponse from the teacher recordings API. */
export interface Recording {
  id: string;
  live_class_id: string;
  live_class_title: string;
  batch_id: string;
  batch_name: string;
  subject_id: string;
  subject_name: string;
  title: string;
  description: string;
  link: string;
  status: RecordingStatus;
  admin_notes: string | null;
  raised_for_edit: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecordingCreatePayload {
  title: string;
  description: string;
  link: string;
  status?: RecordingStatus;
}

export type RecordingUpdatePayload = Partial<RecordingCreatePayload>;

export interface RecordingFilters {
  batch_id?: string;
  subject_id?: string;
  status?: RecordingStatus;
  search?: string;
}

/** Local Formik values for the create/edit recording form. */
export interface RecordingFormValues {
  title: string;
  description: string;
  link: string;
  status: RecordingStatus;
}
