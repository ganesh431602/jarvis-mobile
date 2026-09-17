export interface ApiSuccess<T> { success: true; data: T; }
export interface ApiError { code: string; message: string; details?: Readonly<Record<string, string>>; }
export interface ApiFailure { success: false; error: ApiError; }
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
export interface PaginatedResponse<T> { items: readonly T[]; page: number; pageSize: number; total: number; }
export interface PaginationQuery { page?: number; pageSize?: number; }
export type { Identifier } from "../../types/security.js";
