import type { Metadata } from "next";
import { IntegrationsPage } from "@/components/pages/IntegrationsPage";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Integrations | ${APP_NAME}`,
};

export default function Page() {
  return <IntegrationsPage />;
}
