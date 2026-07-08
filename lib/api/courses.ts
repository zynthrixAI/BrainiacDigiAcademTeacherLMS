import { axiosInstance, authHeader } from "@/lib/axios";
import { TEACHER_API_PREFIX } from "@/lib/constants";
import type { CourseOption } from "@/types/course";

interface CourseListResponse {
  items: CourseOption[];
  total: number;
}

/**
 * Published courses a batch can be linked to (its subject's courses).
 * Ownership-checked server-side — only the batch's teacher may call it.
 */
export async function listCoursesForBatch(
  accessToken: string,
  batchId: string,
): Promise<CourseListResponse> {
  const { data } = await axiosInstance.get<CourseListResponse>(
    `${TEACHER_API_PREFIX}/batches/${batchId}/courses`,
    authHeader(accessToken),
  );
  return data;
}
