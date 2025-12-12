import { SubraClient } from "@subra/sdk";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const apiClient = new SubraClient({ apiUrl });

/**
 * Set the access token for authenticated API requests
 */
export function setAccessToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("subra_token", token);
    apiClient.setAccessToken(token);
  }
}

/**
 * Get the access token from localStorage
 */
export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("subra_token");
  }
  return null;
}

/**
 * Clear the access token
 */
export function clearAccessToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("subra_token");
  }
}

/**
 * Initialize the API client with stored token
 */
export function initializeApiClient() {
  const token = getAccessToken();
  if (token) {
    apiClient.setAccessToken(token);
  }
}

