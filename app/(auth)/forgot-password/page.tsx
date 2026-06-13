import type { Metadata } from "next";
import { ForgotPasswordPage } from "@/components/pages/ForgotPasswordPage";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Reset password | ${APP_NAME}`,
};

export default function Page() {
  return <ForgotPasswordPage />;
}
