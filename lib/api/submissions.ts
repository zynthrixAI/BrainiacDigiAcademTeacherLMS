import { axiosInstance, authHeader } from "@/lib/axios";
import { TEACHER_API_PREFIX } from "@/lib/constants";
import type { GradeRequest, Submission } from "@/types/submission";

const BASE = TEACHER_API_PREFIX;

export async function listSubmissions(
  accessToken: string,
  assignmentId: string,
): Promise<Submission[]> {
  const { data } = await axiosInstance.get<Submission[]>(
    `${BASE}/assignments/${assignmentId}/submissions/`,
    authHeader(accessToken),
  );
  return data;
}

export async function getSubmission(
  accessToken: string,
  submissionId: string,
): Promise<Submission> {
  const { data } = await axiosInstance.get<Submission>(
    `${BASE}/submissions/${submissionId}`,
    authHeader(accessToken),
  );
  return data;
}

export async function gradeSubmission(
  accessToken: string,
  submissionId: string,
  body: GradeRequest,
): Promise<Submission> {
  const { data } = await axiosInstance.patch<Submission>(
    `${BASE}/submissions/${submissionId}/grade`,
    body,
    authHeader(accessToken),
  );
  return data;
}

export async function releaseGrade(
  accessToken: string,
  submissionId: string,
): Promise<Submission> {
  const { data } = await axiosInstance.post<Submission>(
    `${BASE}/submissions/${submissionId}/release`,
    null,
    authHeader(accessToken),
  );
  return data;
}
