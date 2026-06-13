import type { Metadata } from "next";
import { BatchDetailPage } from "@/components/pages/BatchDetailPage";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Batch · Live classes | ${APP_NAME}`,
};

export default async function Page({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;
  return <BatchDetailPage batchId={batchId} />;
}
