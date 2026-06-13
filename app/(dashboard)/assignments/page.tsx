import type { Metadata } from "next";
import { AssignmentsPage } from "@/components/pages/AssignmentsPage";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Assignments | ${APP_NAME}`,
};

export default function Page() {
  return <AssignmentsPage />;
}
