import { axiosInstance } from "@/lib/axios";
import { TEACHER_API_PREFIX } from "@/lib/constants";
import type {
  ConfirmResetPayload,
  MessageResponse,
  RefreshTokenPayload,
  RequestPasswordResetPayload,
  TeacherLoginPayload,
  TeacherProfile,
  TeacherTokens,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "@/types/auth";

export async function loginTeacher(
  payload: TeacherLoginPayload,
): Promise<TeacherTokens> {
  const { data } = await axiosInstance.post<TeacherTokens>(
    `${TEACHER_API_PREFIX}/login`,
    payload,
  );
  return data;
}

export async function refreshTeacherToken(
  payload: RefreshTokenPayload,
): Promise<TeacherTokens> {
  const { data } = await axiosInstance.post<TeacherTokens>(
    `${TEACHER_API_PREFIX}/refresh`,
    payload,
  );
  return data;
}

export async function requestTeacherPasswordReset(
  payload: RequestPasswordResetPayload,
): Promise<MessageResponse> {
  const { data } = await axiosInstance.post<MessageResponse>(
    `${TEACHER_API_PREFIX}/reset-password/request`,
    payload,
  );
  return data;
}

export async function verifyTeacherResetOtp(
  payload: VerifyOtpPayload,
): Promise<VerifyOtpResponse> {
  const { data } = await axiosInstance.post<VerifyOtpResponse>(
    `${TEACHER_API_PREFIX}/reset-password/verify-otp`,
    payload,
  );
  return data;
}

export async function confirmTeacherPasswordReset(
  payload: ConfirmResetPayload,
): Promise<MessageResponse> {
  const { data } = await axiosInstance.post<MessageResponse>(
    `${TEACHER_API_PREFIX}/reset-password/confirm`,
    payload,
  );
  return data;
}

export async function getTeacherProfile(
  accessToken: string,
): Promise<TeacherProfile> {
  const { data } = await axiosInstance.get<TeacherProfile>(
    `${TEACHER_API_PREFIX}/profile`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  return data;
}
