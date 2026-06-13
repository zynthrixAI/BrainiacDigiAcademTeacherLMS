import { axiosInstance, authHeader } from "@/lib/axios";
import { TEACHER_API_PREFIX } from "@/lib/constants";
import type {
  Recording,
  RecordingCreatePayload,
  RecordingFilters,
  RecordingUpdatePayload,
} from "@/types/recording";

const BASE = TEACHER_API_PREFIX;

export async function listRecordings(
  accessToken: string,
  filters: RecordingFilters = {},
): Promise<Recording[]> {
  const { data } = await axiosInstance.get<Recording[]>(`${BASE}/recordings/`, {
    ...authHeader(accessToken),
    params: filters,
  });
  return data;
}

export async function createRecording(
  accessToken: string,
  liveClassId: string,
  payload: RecordingCreatePayload,
): Promise<Recording> {
  const { data } = await axiosInstance.post<Recording>(
    `${BASE}/live-classes/${liveClassId}/recordings/`,
    payload,
    authHeader(accessToken),
  );
  return data;
}

export async function updateRecording(
  accessToken: string,
  recordingId: string,
  payload: RecordingUpdatePayload,
): Promise<Recording> {
  const { data } = await axiosInstance.patch<Recording>(
    `${BASE}/recordings/${recordingId}`,
    payload,
    authHeader(accessToken),
  );
  return data;
}

export async function deleteRecording(
  accessToken: string,
  recordingId: string,
): Promise<void> {
  await axiosInstance.delete(
    `${BASE}/recordings/${recordingId}`,
    authHeader(accessToken),
  );
}
