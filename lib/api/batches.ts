import { axiosInstance, authHeader } from "@/lib/axios";
import { TEACHER_API_PREFIX } from "@/lib/constants";
import type { Batch } from "@/types/batch";

export async function getBatches(accessToken: string): Promise<Batch[]> {
  const { data } = await axiosInstance.get<Batch[]>(
    `${TEACHER_API_PREFIX}/batches/`,
    authHeader(accessToken),
  );
  return data;
}
