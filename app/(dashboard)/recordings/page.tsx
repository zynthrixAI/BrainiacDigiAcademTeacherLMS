import type { Metadata } from "next";
import { RecordingsPage } from "@/components/pages/RecordingsPage";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Recordings | ${APP_NAME}`,
};

export default function Page() {
  return <RecordingsPage />;
}
