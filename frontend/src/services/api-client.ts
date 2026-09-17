export interface ApiError { readonly code: string; readonly message: string; readonly details?: Record<string, string>; }
export interface ApiResponse<T> { readonly success: true; readonly data: T } | { readonly success: false; readonly error: ApiError };
const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api/v1";
export class ApiClientError extends Error { constructor(readonly code: string, message: string, readonly status: number) { super(message); } }
export const apiClient = async <T>(path: string, init?: RequestInit): Promise<T> => { const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { Accept: "application/json", ...init?.headers } }); const body = await response.json() as ApiResponse<T>; if (!response.ok || !body.success) { const error = body.success ? { code: "HTTP_ERROR", message: "Request failed" } : body.error; throw new ApiClientError(error.code, error.message, response.status); } return body.data; };
