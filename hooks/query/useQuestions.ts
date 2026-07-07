"use client";

import { useQuery } from "@tanstack/react-query";
import { listQuestions } from "@/lib/api/questions";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { Question, QuestionStatus } from "@/types/question";

interface QuestionListResult {
  items: Question[];
  total: number;
}

export function useQuestions(status?: QuestionStatus) {
  const cookies = useCookies();

  return useQuery<QuestionListResult>({
    queryKey: QUERY_KEYS.questions.list(status),
    queryFn: () => withAuthToken(cookies, (token) => listQuestions(token, status)),
    retry: false,
  });
}
