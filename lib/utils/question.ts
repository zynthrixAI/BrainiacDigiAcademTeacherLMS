import { formatVideoTimestamp } from "@/lib/utils/datetime";
import type { QuestionContext } from "@/types/question";

/**
 * Build the "From lesson: ..." context line for a question, omitting any
 * missing parts gracefully. Returns null when there's nothing to show.
 */
export function formatQuestionContext(context: QuestionContext | null): string | null {
  if (!context) return null;

  const lessonPart = context.lesson_title
    ? context.course_title
      ? `${context.lesson_title} (${context.course_title})`
      : context.lesson_title
    : context.course_title ?? null;

  if (!lessonPart) return null;

  const timestamp =
    typeof context.video_timestamp === "number"
      ? ` at ${formatVideoTimestamp(context.video_timestamp)}`
      : "";

  return `From lesson: ${lessonPart}${timestamp}`;
}
