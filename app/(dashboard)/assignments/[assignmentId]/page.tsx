import type { Metadata } from "next";
import { AssignmentSubmissionsPage } from "@/components/pages/AssignmentSubmissionsPage";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Submissions | ${APP_NAME}`,
};

export default async function Page({
  params,
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const { assignmentId } = await params;
  return <AssignmentSubmissionsPage assignmentId={assignmentId} />;
}
