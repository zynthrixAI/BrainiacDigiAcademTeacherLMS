import type { Metadata } from "next";
import { TeacherLoginPage } from "@/components/pages/TeacherLoginPage";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Sign in | ${APP_NAME}`,
};

export default function Page() {
  return <TeacherLoginPage />;
}
