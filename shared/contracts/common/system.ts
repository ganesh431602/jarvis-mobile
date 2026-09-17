import type { ISODateTime, Metadata } from "../../types/security.js";
export interface FinanceSummary { id: string; periodStart: ISODateTime; periodEnd: ISODateTime; revenue: number; expenses: number; pendingInvoices: number; paidInvoices: number; currency: string; metadata?: Metadata; }
export interface AIUsage { id: string; providerKey?: string; agentId?: string; periodStart: ISODateTime; periodEnd: ISODateTime; dailyTokenUsage: number; monthlyTokenUsage: number; estimatedCost: number; dailyLimit: number; monthlyLimit: number; warningThreshold: number; emergencyStop: boolean; createdAt: ISODateTime; updatedAt: ISODateTime; }
export interface SystemSetting { key: string; value: unknown; description?: string; updatedBy?: string; updatedAt: ISODateTime; }
export interface DashboardSummary { agentCount: number; activeTaskCount: number; pendingApprovalCount: number; finance?: FinanceSummary; aiUsage?: AIUsage; generatedAt: ISODateTime; }
