import { axiosInstance, authHeader } from "@/lib/axios";
import { TEACHER_API_PREFIX } from "@/lib/constants";
import type { ZoomConnectPayload, ZoomStatus } from "@/types/zoom";

const BASE = TEACHER_API_PREFIX;

export async function getZoomStatus(accessToken: string): Promise<ZoomStatus> {
  const { data } = await axiosInstance.get<ZoomStatus>(
    `${BASE}/zoom/status`,
    authHeader(accessToken),
  );
  return data;
}

/**
 * Store (or replace) the teacher's Zoom Server-to-Server OAuth credentials.
 * The backend verifies them against Zoom before saving; 422 detail codes:
 * `invalid_credentials`, `email_not_in_account`; 503 `zoom_rate_limited`.
 */
export async function connectZoom(
  accessToken: string,
  payload: ZoomConnectPayload,
): Promise<ZoomStatus> {
  const { data } = await axiosInstance.post<ZoomStatus>(
    `${BASE}/zoom`,
    payload,
    authHeader(accessToken),
  );
  return data;
}

export async function disconnectZoom(accessToken: string): Promise<void> {
  await axiosInstance.delete(`${BASE}/zoom`, authHeader(accessToken));
}
