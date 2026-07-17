"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { useZoomStatus } from "@/hooks/query/useZoomStatus";
import { useConnectZoom } from "@/hooks/mutations/useConnectZoom";
import { useDisconnectZoom } from "@/hooks/mutations/useDisconnectZoom";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { ZoomCredentialsForm } from "@/components/forms/ZoomCredentialsForm";
import { extractApiError } from "@/lib/utils/apiError";
import { formatDateTime } from "@/lib/utils/datetime";
import type { ZoomConnectPayload } from "@/types/zoom";

/**
 * Where "How to get these values →" points. The docs route may not exist
 * yet — repoint this constant when the setup guide ships.
 */
const TUTORIAL_URL = "/docs/zoom-setup";

/**
 * Fallback messages for the backend's POST /zoom error codes. The backend now
 * also returns an actionable `hint` per failure (which points at the RIGHT
 * fields — e.g. an invalid_client rejection is about the Client ID/Secret, not
 * the Account ID); prefer that when present.
 */
const CONNECT_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials:
    "Zoom rejected your Client ID or Client Secret — re-copy both and make sure the app is Activated",
  email_not_in_account:
    "This email doesn't belong to the Zoom account those credentials are for",
  zoom_rate_limited: "Zoom is rate-limiting requests — try again in a minute",
  zoom_api_error: "Zoom returned an unexpected error — please try again",
};

type ConnectErrorDetail = { code?: string; hint?: string; zoom_reason?: string };

function connectErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const detail = (error.response?.data as { detail?: unknown } | undefined)
      ?.detail;
    // New contract: a structured detail with an actionable hint.
    if (detail && typeof detail === "object") {
      const { code, hint } = detail as ConnectErrorDetail;
      if (typeof hint === "string" && hint) return hint;
      if (typeof code === "string" && code in CONNECT_ERROR_MESSAGES) {
        return CONNECT_ERROR_MESSAGES[code];
      }
    }
    // Back-compat: a plain string detail code.
    if (typeof detail === "string" && detail in CONNECT_ERROR_MESSAGES) {
      return CONNECT_ERROR_MESSAGES[detail];
    }
  }
  return extractApiError(error);
}

type Notice = { type: "success" | "error"; message: string };

export function IntegrationsPage() {
  const { data: zoom, isLoading, isError, error } = useZoomStatus();
  const connectMutation = useConnectZoom();
  const disconnectMutation = useDisconnectZoom();

  const [notice, setNotice] = useState<Notice | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const invalidCredentials = zoom?.status === "invalid_credentials";
  const connected = zoom?.connected === true && !invalidCredentials;

  const handleConnect = async (payload: ZoomConnectPayload) => {
    setNotice(null);
    await connectMutation.mutateAsync(payload);
    setNotice({ type: "success", message: "Zoom account connected." });
    setShowUpdateForm(false);
  };

  const handleDisconnect = () => {
    if (
      !window.confirm(
        "Disconnect Zoom? New live classes will no longer get a meeting link automatically — you can still paste one manually.",
      )
    ) {
      return;
    }
    disconnectMutation.mutate(undefined, {
      onSuccess: () => {
        setNotice({ type: "success", message: "Zoom account disconnected." });
        setShowUpdateForm(false);
      },
    });
  };

  const openUpdateForm = () => {
    connectMutation.reset();
    setNotice(null);
    setShowUpdateForm(true);
  };

  const credentialsForm = (
    <ZoomCredentialsForm
      // Prefill only the non-secret fields — secrets are never echoed back.
      initialEmail={zoom?.zoom_email ?? ""}
      initialAccountId={zoom?.zoom_account_id ?? ""}
      submitLabel={
        connected || invalidCredentials ? "Save credentials" : "Connect Zoom"
      }
      pending={connectMutation.isPending}
      errorMessage={
        connectMutation.isError
          ? connectErrorMessage(connectMutation.error)
          : undefined
      }
      onCancel={
        connected && showUpdateForm
          ? () => setShowUpdateForm(false)
          : undefined
      }
      onSubmit={handleConnect}
    />
  );

  const tutorialLink = (
    <a
      href={TUTORIAL_URL}
      target="_blank"
      rel="noreferrer"
      className="text-xs font-bold text-yellow-ink hover:underline"
    >
      How to get these values &rarr;
    </a>
  );

  return (
    <div className="mx-auto w-full max-w-[720px]">
      <div className="mb-5 flex flex-col">
        <h1 className="m-0 font-display text-[26px] font-extrabold tracking-[-0.01em] text-ink">
          Integrations
        </h1>
        <span className="mt-1 text-sm text-muted">
          Connect external tools to your teaching workspace.
        </span>
      </div>

      {notice ? (
        notice.type === "error" ? (
          <div className="mb-4">
            <FormError message={notice.message} />
          </div>
        ) : (
          <div
            role="status"
            className="mb-4 rounded-[10px] border border-[#a7f3d0] bg-[#ecfdf5] p-3 text-xs font-semibold text-green"
          >
            {notice.message}
          </div>
        )
      ) : null}

      <div className="rounded-[14px] border border-line bg-bg-elev p-5 shadow-[0_1px_2px_rgba(28,27,27,0.03)]">
        <div className="flex items-start gap-3">
          <span className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[10px] bg-[#eef2ff] font-display text-[15px] font-extrabold text-blue">
            Z
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-[15px] font-bold text-ink">
                Zoom
              </span>
              {connected ? (
                <span className="inline-flex items-center rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[11px] font-bold text-green">
                  Connected
                </span>
              ) : null}
              {invalidCredentials ? (
                <span className="inline-flex items-center rounded-full bg-[#fef3c7] px-2 py-0.5 text-[11px] font-bold text-[#92400e]">
                  Credentials rejected
                </span>
              ) : null}
            </div>
            <p className="m-0 text-sm text-muted">
              Connect your Zoom account and every live class you schedule gets
              its meeting link created automatically about 15 minutes before it
              starts — no more copy-pasting URLs.
            </p>
          </div>
        </div>

        {invalidCredentials ? (
          <div
            role="alert"
            className="mt-4 rounded-[10px] border border-[#fde68a] bg-[#fef3c7] p-3 text-xs font-semibold text-[#92400e]"
          >
            Zoom rejected the stored credentials — re-enter them.
          </div>
        ) : null}

        <div className="mt-4 border-t border-line pt-4">
          {isLoading ? (
            <p className="m-0 py-2 text-sm text-muted">
              Checking Zoom connection…
            </p>
          ) : isError ? (
            <FormError message={extractApiError(error)} />
          ) : connected ? (
            <div className="flex flex-col gap-4">
              {disconnectMutation.isError ? (
                <FormError message={extractApiError(disconnectMutation.error)} />
              ) : null}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold text-ink">
                    {zoom?.zoom_email ?? "Zoom account"}
                  </span>
                  {zoom?.zoom_account_id ? (
                    <span className="truncate text-xs text-muted">
                      Account ID: {zoom.zoom_account_id}
                    </span>
                  ) : null}
                  {zoom?.connected_at ? (
                    <span className="text-xs text-muted">
                      Connected {formatDateTime(zoom.connected_at)}
                    </span>
                  ) : null}
                  <span className="text-xs text-muted-2">
                    Event token:{" "}
                    {zoom?.has_event_secret_token ? "provided" : "not provided"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {!showUpdateForm ? (
                    <Button
                      variant="ghost"
                      className="px-3 py-1.5 text-xs"
                      onClick={openUpdateForm}
                    >
                      Update credentials
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    className="px-3 py-1.5 text-xs text-red"
                    isLoading={disconnectMutation.isPending}
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>

              {showUpdateForm ? (
                <div className="flex flex-col gap-3 border-t border-line pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-muted">
                      Paste the credentials from your Zoom Server-to-Server
                      OAuth app. Secrets are never shown again — re-enter them
                      in full.
                    </span>
                    {tutorialLink}
                  </div>
                  {credentialsForm}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="m-0 max-w-[520px] text-xs text-muted">
                  Create a Server-to-Server OAuth app in your Zoom account and
                  paste its credentials — takes ~5 minutes.
                </p>
                {tutorialLink}
              </div>
              {credentialsForm}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
