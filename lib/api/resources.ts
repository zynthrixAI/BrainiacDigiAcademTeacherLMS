import { axiosInstance, authHeader, authMultipart } from "@/lib/axios";
import { TEACHER_API_PREFIX } from "@/lib/constants";
import type { ResourceItem } from "@/types/resource";

const BASE = TEACHER_API_PREFIX;

interface BatchMaterialsResponse {
  materials: ResourceItem[];
}

export async function listBatchMaterials(
  accessToken: string,
  batchId: string,
): Promise<ResourceItem[]> {
  const { data } = await axiosInstance.get<BatchMaterialsResponse>(
    `${BASE}/batches/${batchId}/materials`,
    authHeader(accessToken),
  );
  return data.materials;
}

export async function addRecordingResource(
  accessToken: string,
  recordingId: string,
  formData: FormData,
): Promise<ResourceItem> {
  const { data } = await axiosInstance.post<ResourceItem>(
    `${BASE}/recordings/${recordingId}/resources`,
    formData,
    authMultipart(accessToken),
  );
  return data;
}

export async function deleteRecordingResource(
  accessToken: string,
  recordingId: string,
  resourceId: string,
): Promise<void> {
  await axiosInstance.delete(
    `${BASE}/recordings/${recordingId}/resources/${resourceId}`,
    authHeader(accessToken),
  );
}

export async function addBatchMaterial(
  accessToken: string,
  batchId: string,
  formData: FormData,
): Promise<ResourceItem> {
  const { data } = await axiosInstance.post<ResourceItem>(
    `${BASE}/batches/${batchId}/materials`,
    formData,
    authMultipart(accessToken),
  );
  return data;
}

export async function deleteBatchMaterial(
  accessToken: string,
  batchId: string,
  resourceId: string,
): Promise<void> {
  await axiosInstance.delete(
    `${BASE}/batches/${batchId}/materials/${resourceId}`,
    authHeader(accessToken),
  );
}
