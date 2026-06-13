import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/** Bearer-auth request config for endpoints that need the teacher access token. */
export function authHeader(accessToken: string) {
  return { headers: { Authorization: `Bearer ${accessToken}` } };
}

/**
 * Bearer-auth config for multipart/form-data uploads. Content-Type is left
 * undefined so the browser sets it with the correct multipart boundary.
 */
export function authMultipart(accessToken: string) {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": undefined,
    },
  };
}
