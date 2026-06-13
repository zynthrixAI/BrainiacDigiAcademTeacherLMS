import { axiosInstance, authHeader, authMultipart } from "@/lib/axios";
import { TEACHER_API_PREFIX } from "@/lib/constants";
import type { Assignment } from "@/types/assignment";

const BASE = TEACHER_API_PREFIX;

export async function listAssignments(
  accessToken: string,
  batchId: string,
): Promise<Assignment[]> {
  const { data } = await axiosInstance.get<Assignment[]>(
    `${BASE}/batches/${batchId}/assignments/`,
    authHeader(accessToken),
  );
  return data;
}

export async function getAssignment(
  accessToken: string,
  assignmentId: string,
): Promise<Assignment> {
  const { data } = await axiosInstance.get<Assignment>(
    `${BASE}/assignments/${assignmentId}`,
    authHeader(accessToken),
  );
  return data;
}

export async function createAssignment(
  accessToken: string,
  batchId: string,
  formData: FormData,
): Promise<Assignment> {
  const { data } = await axiosInstance.post<Assignment>(
    `${BASE}/batches/${batchId}/assignments/`,
    formData,
    authMultipart(accessToken),
  );
  return data;
}

export async function updateAssignment(
  accessToken: string,
  assignmentId: string,
  formData: FormData,
): Promise<Assignment> {
  const { data } = await axiosInstance.patch<Assignment>(
    `${BASE}/assignments/${assignmentId}`,
    formData,
    authMultipart(accessToken),
  );
  return data;
}

export async function deleteAssignment(
  accessToken: string,
  assignmentId: string,
): Promise<void> {
  await axiosInstance.delete(
    `${BASE}/assignments/${assignmentId}`,
    authHeader(accessToken),
  );
}
