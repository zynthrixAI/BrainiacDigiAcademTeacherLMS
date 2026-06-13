import { axiosInstance, authHeader } from "@/lib/axios";
import { TEACHER_API_PREFIX } from "@/lib/constants";
import type { PaginatedResponse } from "@/types/api";
import type { AttendanceListResponse } from "@/types/attendance";
import type {
  LiveClass,
  LiveClassCancelPayload,
  LiveClassCreatePayload,
  LiveClassListParams,
  LiveClassUpdatePayload,
} from "@/types/liveClass";

const BASE = TEACHER_API_PREFIX;

export async function listLiveClasses(
  accessToken: string,
  batchId: string,
  params: LiveClassListParams,
): Promise<PaginatedResponse<LiveClass>> {
  const { data } = await axiosInstance.get<PaginatedResponse<LiveClass>>(
    `${BASE}/batches/${batchId}/live-classes/`,
    { ...authHeader(accessToken), params },
  );
  return data;
}

export async function createLiveClass(
  accessToken: string,
  batchId: string,
  payload: LiveClassCreatePayload,
): Promise<LiveClass> {
  const { data } = await axiosInstance.post<LiveClass>(
    `${BASE}/batches/${batchId}/live-classes/`,
    payload,
    authHeader(accessToken),
  );
  return data;
}

export async function getLiveClass(
  accessToken: string,
  liveClassId: string,
): Promise<LiveClass> {
  const { data } = await axiosInstance.get<LiveClass>(
    `${BASE}/live-classes/${liveClassId}`,
    authHeader(accessToken),
  );
  return data;
}

export async function updateLiveClass(
  accessToken: string,
  liveClassId: string,
  payload: LiveClassUpdatePayload,
): Promise<LiveClass> {
  const { data } = await axiosInstance.patch<LiveClass>(
    `${BASE}/live-classes/${liveClassId}`,
    payload,
    authHeader(accessToken),
  );
  return data;
}

export async function startLiveClass(
  accessToken: string,
  liveClassId: string,
): Promise<LiveClass> {
  const { data } = await axiosInstance.post<LiveClass>(
    `${BASE}/live-classes/${liveClassId}/start`,
    null,
    authHeader(accessToken),
  );
  return data;
}

export async function endLiveClass(
  accessToken: string,
  liveClassId: string,
): Promise<AttendanceListResponse> {
  const { data } = await axiosInstance.post<AttendanceListResponse>(
    `${BASE}/live-classes/${liveClassId}/end`,
    null,
    authHeader(accessToken),
  );
  return data;
}

export async function cancelLiveClass(
  accessToken: string,
  liveClassId: string,
  payload: LiveClassCancelPayload,
): Promise<LiveClass> {
  const { data } = await axiosInstance.post<LiveClass>(
    `${BASE}/live-classes/${liveClassId}/cancel`,
    payload,
    authHeader(accessToken),
  );
  return data;
}

export async function deleteLiveClass(
  accessToken: string,
  liveClassId: string,
): Promise<void> {
  await axiosInstance.delete(
    `${BASE}/live-classes/${liveClassId}`,
    authHeader(accessToken),
  );
}

export async function getLiveClassAttendance(
  accessToken: string,
  liveClassId: string,
): Promise<AttendanceListResponse> {
  const { data } = await axiosInstance.get<AttendanceListResponse>(
    `${BASE}/live-classes/${liveClassId}/attendance`,
    authHeader(accessToken),
  );
  return data;
}
