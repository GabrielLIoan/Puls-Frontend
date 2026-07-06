// Centralized so the base URL, auth header, and error handling live in
// exactly one place. Every screen/hook calls through this rather than
// calling fetch() directly.
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_BASE_URL: string =
  Constants.expoConfig?.extra?.apiBaseUrl ?? 'http://localhost:3089';

const TOKEN_KEY = 'puls_access_token';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// --- Token storage ---
// expo-secure-store wraps the iOS Keychain / Android Keystore — the
// right place for an auth token, unlike AsyncStorage (plain, unencrypted)
// or in-memory only (lost on every app restart).

  export const tokenStorage = {
    async get(): Promise<string | null> {
      if (Platform.OS === 'web') {
        return localStorage.getItem(TOKEN_KEY);
      }
      return SecureStore.getItemAsync(TOKEN_KEY);
    },
    async set(token: string): Promise<void> {
      if (Platform.OS === 'web') {
        localStorage.setItem(TOKEN_KEY, token);
        return;
      }
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    },
    async clear(): Promise<void> {
      if (Platform.OS === 'web') {
        localStorage.removeItem(TOKEN_KEY);
        return;
      }
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    },
  };

// --- 401 handling ---
// Set by AuthContext on mount so that ANY request anywhere in the app
// that comes back 401 can trigger a global logout/redirect-to-login,
// without every single call site needing to handle it individually.
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await tokenStorage.get();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    ...init,
  });

  if (res.status === 401) {
    onUnauthorized?.();
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new ApiError(res.status, body || res.statusText);
  }

  // Some endpoints (DELETE handlers) return no body
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};