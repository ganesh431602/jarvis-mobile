import type { ClientStatus, ProjectStatus, TaskPriority, TaskStatus } from "../../enums/index.js";
import type { ISODateTime } from "../../types/security.js";
export interface Task { id: string; title: string; description?: string; priority: TaskPriority; status: TaskStatus; assignedAgentId?: string; clientId?: string; projectId?: string; dueDate?: ISODateTime; createdBy: string; createdAt: ISODateTime; updatedAt: ISODateTime; }
export interface Client { id: string; name: string; company?: string; status: ClientStatus; notes?: string; createdBy?: string; createdAt: ISODateTime; updatedAt: ISODateTime; }
export interface Project { id: string; clientId: string; name: string; description?: string; status: ProjectStatus; createdAt: ISODateTime; updatedAt: ISODateTime; }
