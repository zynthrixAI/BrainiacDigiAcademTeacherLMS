import type { Metadata } from "next";
import { LiveClassesPage } from "@/components/pages/LiveClassesPage";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Live classes | ${APP_NAME}`,
};

export default function Page() {
  return <LiveClassesPage />;
}
