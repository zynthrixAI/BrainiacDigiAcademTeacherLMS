/** Connection state of the teacher's stored Zoom credentials. */
export type ZoomConnectionStatus = "connected" | "invalid_credentials";

/** ZoomStatusResponse from GET /zoom/status. */
export interface ZoomStatus {
  connected: boolean;
  status: ZoomConnectionStatus | null;
  zoom_email: string | null;
  zoom_account_id: string | null;
  connected_at: string | null;
  has_event_secret_token: boolean;
}

/**
 * Body of POST /zoom — credentials of a Server-to-Server OAuth app the
 * teacher created in their own Zoom account.
 */
export interface ZoomConnectPayload {
  zoom_email: string;
  zoom_account_id: string;
  zoom_client_id: string;
  zoom_client_secret: string;
  zoom_event_secret_token?: string;
}
