"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import type { ZoomConnectPayload } from "@/types/zoom";

const validationSchema = Yup.object({
  zoom_email: Yup.string()
    .email("Enter a valid email")
    .required("Zoom email is required"),
  zoom_account_id: Yup.string().required("Account ID is required"),
  zoom_client_id: Yup.string().required("Client ID is required"),
  zoom_client_secret: Yup.string().required("Client Secret is required"),
  zoom_event_secret_token: Yup.string(),
});

interface ZoomCredentialsFormValues {
  zoom_email: string;
  zoom_account_id: string;
  zoom_client_id: string;
  zoom_client_secret: string;
  zoom_event_secret_token: string;
}

interface ZoomCredentialsFormProps {
  /** Prefill for the email field only — secrets are never prefilled. */
  initialEmail?: string;
  /** Prefill for the Account ID field only — secrets are never prefilled. */
  initialAccountId?: string;
  submitLabel: string;
  pending: boolean;
  errorMessage?: string;
  /** When provided, renders a Cancel button next to the submit button. */
  onCancel?: () => void;
  onSubmit: (payload: ZoomConnectPayload) => Promise<void>;
}

export function ZoomCredentialsForm({
  initialEmail = "",
  initialAccountId = "",
  submitLabel,
  pending,
  errorMessage,
  onCancel,
  onSubmit,
}: ZoomCredentialsFormProps) {
  const initialValues: ZoomCredentialsFormValues = {
    zoom_email: initialEmail,
    zoom_account_id: initialAccountId,
    zoom_client_id: "",
    zoom_client_secret: "",
    zoom_event_secret_token: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        try {
          const eventToken = values.zoom_event_secret_token.trim();
          await onSubmit({
            zoom_email: values.zoom_email.trim(),
            zoom_account_id: values.zoom_account_id.trim(),
            zoom_client_id: values.zoom_client_id.trim(),
            zoom_client_secret: values.zoom_client_secret.trim(),
            // Omit (not empty string) when blank — the token is optional.
            ...(eventToken ? { zoom_event_secret_token: eventToken } : {}),
          });
        } catch {
          // Surfaced via the errorMessage banner below.
        }
      }}
    >
      <Form className="flex flex-col gap-4" noValidate>
        <InputField
          name="zoom_email"
          label="Zoom Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="off"
        />
        <InputField
          name="zoom_account_id"
          label="Account ID"
          placeholder="e.g. AbC1dEfGhIjKlMnOpQrStU"
          autoComplete="off"
        />
        <InputField
          name="zoom_client_id"
          label="Client ID"
          placeholder="e.g. Ab1CdEfGh2IjKlMnOpQrSt"
          autoComplete="off"
        />
        <InputField
          name="zoom_client_secret"
          label="Client Secret"
          type="password"
          placeholder="Paste your app's Client Secret"
          autoComplete="off"
        />
        <div className="flex flex-col gap-1.5">
          <InputField
            name="zoom_event_secret_token"
            label="Event Secret Token (optional)"
            placeholder="Paste your app's Secret Token"
            autoComplete="off"
          />
          <span className="text-xs text-muted">
            Found under your Zoom app&apos;s Features &rarr; Event
            Subscriptions; needed for recording automation later
          </span>
        </div>

        <FormError message={errorMessage} />

        <div className="flex items-center gap-3">
          <Button type="submit" isLoading={pending} className="flex-1">
            {pending ? "Verifying with Zoom…" : submitLabel}
          </Button>
          {onCancel ? (
            <Button
              type="button"
              variant="ghost"
              className="px-4"
              disabled={pending}
              onClick={onCancel}
            >
              Cancel
            </Button>
          ) : null}
        </div>
      </Form>
    </Formik>
  );
}
