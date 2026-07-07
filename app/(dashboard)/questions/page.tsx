import type { Metadata } from "next";
import { QuestionsPage } from "@/components/pages/QuestionsPage";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Questions | ${APP_NAME}`,
};

export default function Page() {
  return <QuestionsPage />;
}
