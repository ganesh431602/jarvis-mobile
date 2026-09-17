export interface AgentInput { name: string; department: string; description?: string; enabled?: boolean; }
export interface AgentUpdateInput { name?: string; department?: string; description?: string; enabled?: boolean; }
export interface PermissionAssignmentInput { agentId: string; permissionKey: string; scope?: Readonly<Record<string, unknown>>; }
export interface TaskInput { title: string; description?: string; priority: string; assignedAgentId?: string; clientId?: string; projectId?: string; dueDate?: string; }
export interface ClientInput { name: string; company?: string; notes?: string; }
export interface ProjectInput { clientId: string; name: string; description?: string; }
export interface ApprovalDecisionInput { status: "APPROVED" | "REJECTED"; reason?: string; }
export interface SystemSettingInput { key: string; value: unknown; }
export interface IntegrationStatusInput { status: string; configuration?: Readonly<Record<string, unknown>>; }
export interface PaginationInput { page?: number; pageSize?: number; }
export type ValidationResult = { valid: true } | { valid: false; errors: readonly string[] };
export const validatePagination = (input: PaginationInput): ValidationResult => input.page !== undefined && input.page < 1 ? { valid: false, errors: ["page must be positive"] } : input.pageSize !== undefined && (input.pageSize < 1 || input.pageSize > 100) ? { valid: false, errors: ["pageSize must be between 1 and 100"] } : { valid: true };
export const requiredText = (value: string | undefined, field: string): ValidationResult => value?.trim() ? { valid: true } : { valid: false, errors: [`${field} is required`] };
