export type TeacherLevel = "O" | "A";

export interface TeacherLoginPayload {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  refresh_token: string;
}

/** Shape returned by POST /login and POST /refresh. */
export interface TeacherTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  level: TeacherLevel;
  phone: string | null;
  bio: string | null;
  profile_picture: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RequestPasswordResetPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  reset_token: string;
}

export interface ConfirmResetPayload {
  reset_token: string;
  new_password: string;
}

export interface MessageResponse {
  message: string;
}

/** Local Formik values for the forgot-password OTP step. */
export interface VerifyOtpFormValues {
  otp: string;
}

/** Local Formik values for the forgot-password new-password step. */
export interface ResetPasswordFormValues {
  new_password: string;
  confirm_password: string;
}
