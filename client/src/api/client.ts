/**
 * API client with authorization
 */

export type AuthData = {
  type: 'Telegram' | 'Keycloak';
  signature: string;
};

let authData: AuthData | undefined;

export function setAuthData(data: AuthData) {
  authData = data;
}

export function getAuthData(): AuthData | undefined {
  return authData;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const { headers: headerValues, ...optionsValues } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headerValues as Record<string, string>),
    ...(authData && { 'X-Auth': JSON.stringify(authData) }),
  };

  const response = await fetch(endpoint, {
    ...optionsValues,
    headers: headers,
  });

  return response.ok ? response.json() : Promise.reject(response);
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};
