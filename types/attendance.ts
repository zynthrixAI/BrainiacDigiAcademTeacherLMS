export type AttendanceStatus = "present" | "late" | "absent";

export interface AttendanceRecord {
  id: string;
  live_class_id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  joined_at: string | null;
  left_at: string | null;
  status: AttendanceStatus;
  created_at: string;
}

export interface AttendanceListResponse {
  live_class_id: string;
  total: number;
  present: number;
  late: number;
  absent: number;
  records: AttendanceRecord[];
}
