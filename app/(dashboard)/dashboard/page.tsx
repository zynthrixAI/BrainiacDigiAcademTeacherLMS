import type { Metadata } from "next";
import { TeacherDashboardPage } from "@/components/pages/TeacherDashboardPage";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Dashboard | ${APP_NAME}`,
};

export default function Page() {
  return <TeacherDashboardPage />;
}
