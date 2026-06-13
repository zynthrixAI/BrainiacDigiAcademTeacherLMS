export type SubjectLevel = "O" | "A";

export interface Subject {
  id: string;
  code: string;
  title: string;
  level: SubjectLevel;
  color: string;
  studentCount: number;
  published: boolean;
}
