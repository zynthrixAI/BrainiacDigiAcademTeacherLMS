import type { Metadata } from "next";
import { EarningsPage } from "@/components/pages/EarningsPage";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Earnings | ${APP_NAME}`,
};

export default function Page() {
  return <EarningsPage />;
}
