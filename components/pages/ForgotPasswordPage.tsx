"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StepIndicator } from "@/components/widgets/StepIndicator";
import { RequestResetForm } from "@/components/forms/RequestResetForm";
import { VerifyOtpForm } from "@/components/forms/VerifyOtpForm";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { ROUTES } from "@/lib/constants";

const STEP_LABELS = ["Email", "Verify", "Password"];

const STEP_COPY = [
  {
    title: "Forgot your password?",
    subtitle:
      "Enter the email on your Brainiacs teacher account and we'll send a 6-digit reset code.",
  },
  {
    title: "Enter your reset code",
    subtitle: "Check your inbox for the code. It expires in 5 minutes.",
  },
  {
    title: "Set a new password",
    subtitle: "Choose a strong password you haven't used before.",
  },
] as const;

type Step = 0 | 1 | 2;

export function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isDone, setIsDone] = useState(false);

  if (isDone) {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-ink">
          <CheckIcon size={22} />
        </span>
        <h2 className="mt-5 mb-0 font-display text-[26px] font-extrabold tracking-[-0.01em] text-ink">
          Password reset
        </h2>
        <p className="mx-auto mt-2 mb-0 max-w-[320px] text-sm leading-[1.55] text-muted">
          Your password has been updated. Any other sessions were signed out —
          please sign in with your new password.
        </p>
        <Button
          className="mt-7 w-full"
          onClick={() => router.push(ROUTES.login)}
        >
          Back to sign in
          <ArrowRightIcon size={14} />
        </Button>
      </div>
    );
  }

  const copy = STEP_COPY[step];

  return (
    <div>
      <StepIndicator steps={STEP_LABELS} currentStep={step} />

      <h2 className="mt-6 mb-0 font-display text-[28px] font-extrabold tracking-[-0.01em] text-ink">
        {copy.title}
      </h2>
      <p className="m-0 mt-2 text-sm leading-[1.55] text-muted">
        {copy.subtitle}
      </p>

      {step === 0 ? (
        <RequestResetForm
          defaultEmail={email}
          onSent={(sentEmail) => {
            setEmail(sentEmail);
            setStep(1);
          }}
        />
      ) : null}

      {step === 1 ? (
        <VerifyOtpForm
          email={email}
          onVerified={(token) => {
            setResetToken(token);
            setStep(2);
          }}
        />
      ) : null}

      {step === 2 ? (
        <ResetPasswordForm
          resetToken={resetToken}
          onReset={() => setIsDone(true)}
        />
      ) : null}

      <div className="mt-6 flex items-center justify-center gap-2">
        {step > 0 ? (
          <>
            <button
              type="button"
              onClick={() => setStep((step - 1) as Step)}
              className="text-xs font-semibold text-muted hover:text-ink"
            >
              Back
            </button>
            <span className="text-xs text-muted">·</span>
          </>
        ) : null}
        <Link
          href={ROUTES.login}
          className="text-xs font-semibold text-muted hover:text-ink"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
