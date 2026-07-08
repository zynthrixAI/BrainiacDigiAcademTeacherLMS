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

/** Set (`courseId`) or clear (`null`) the course a batch follows. */
export async function setBatchCourse(
  accessToken: string,
  batchId: string,
  courseId: string | null,
): Promise<Batch> {
  const { data } = await axiosInstance.patch<Batch>(
    `${TEACHER_API_PREFIX}/batches/${batchId}/course`,
    { course_id: courseId },
    authHeader(accessToken),
  );
  return data;
}
