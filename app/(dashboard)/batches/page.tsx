import type { Metadata } from "next";
import { BatchesPage } from "@/components/pages/BatchesPage";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `My batches | ${APP_NAME}`,
};

export default function Page() {
  return <BatchesPage />;
}
