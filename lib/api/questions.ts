import { axiosInstance, authHeader } from "@/lib/axios";
import { TEACHER_API_PREFIX } from "@/lib/constants";
import type { Question, QuestionStatus } from "@/types/question";

const BASE = TEACHER_API_PREFIX;

interface QuestionListResponse {
  items: Question[];
  total: number;
}

export async function listQuestions(
  accessToken: string,
  status?: QuestionStatus,
): Promise<QuestionListResponse> {
  const { data } = await axiosInstance.get<QuestionListResponse>(
    `${BASE}/questions/`,
    {
      ...authHeader(accessToken),
      params: status ? { status } : undefined,
    },
  );
  return data;
}

export async function answerQuestion(
  accessToken: string,
  questionId: string,
  answer: string,
): Promise<Question> {
  const { data } = await axiosInstance.post<Question>(
    `${BASE}/questions/${questionId}/answer`,
    { answer },
    authHeader(accessToken),
  );
  return data;
}
