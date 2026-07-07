"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { answerQuestion } from "@/lib/api/questions";
import { useCookies } from "@/hooks/useCookies";
import { withAuthToken } from "@/lib/utils/withAuthToken";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { Question } from "@/types/question";

interface AnswerQuestionVariables {
  id: string;
  answer: string;
}

export function useAnswerQuestion() {
  const cookies = useCookies();
  const queryClient = useQueryClient();

  return useMutation<Question, Error, AnswerQuestionVariables>({
    mutationFn: ({ id, answer }) =>
      withAuthToken(cookies, (token) => answerQuestion(token, id, answer)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.questions.root });
    },
  });
}
