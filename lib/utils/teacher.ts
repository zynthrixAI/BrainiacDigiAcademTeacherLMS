import type { TeacherLevel } from "@/types/auth";

/** Initials from a full name, e.g. "Jane Smith" → "JS". */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/** First name for greetings, e.g. "Jane Smith" → "Jane". */
export function getFirstName(name: string): string {
  return name.trim().split(/\s+/).filter(Boolean)[0] ?? "";
}

/** Human-readable role label from the teacher's level. */
export function getTeacherRole(level: TeacherLevel): string {
  return level === "A" ? "A Level Teacher" : "O Level Teacher";
}
