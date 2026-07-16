export type LiveClassStatus =
  | "scheduled"
  | "live"
  | "ended"
  | "cancelled"
  | "past_due";

/** Progress of the automatic Zoom-meeting creation for a live class. */
export type ZoomCreationStatus = "pending" | "created" | "failed";

/** LiveClassResponse from the teacher live-classes API. */
export interface LiveClass {
  id: string;
  batch_id: string;
  batch_name: string;
  subject_id: string;
  subject_name: string;
  title: string;
  total_duration: number;
  meeting_url: string | null;
  host_url: string | null;
  meeting_id: string | null;
  zoom_creation_status: ZoomCreationStatus | null;
  teacher_name: string | null;
  scheduled_at: string;
  started_at: string | null;
  ended_at: string | null;
  status: LiveClassStatus;
  cancelled_at: string | null;
  cancel_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface LiveClassCreatePayload {
  title: string;
  total_duration: number;
  /** Omitted (not null) when empty and Zoom is connected — the backend then auto-creates the meeting. */
  meeting_url?: string;
  host_url?: string;
  meeting_id?: string;
  scheduled_at: string;
}

export type LiveClassUpdatePayload = Partial<LiveClassCreatePayload>;

export interface LiveClassCancelPayload {
  cancel_reason: string;
}

export interface LiveClassListParams {
  page?: number;
  limit?: number;
  status?: LiveClassStatus;
}

/** Local Formik values for the schedule/edit-class form. */
export interface LiveClassFormValues {
  title: string;
  scheduled_at: string;
  total_duration: string;
  meeting_url: string;
  host_url: string;
  meeting_id: string;
}
