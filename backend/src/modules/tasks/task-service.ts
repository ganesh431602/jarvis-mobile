import { randomUUID } from "node:crypto";
import { AgentRiskLevel, PermissionKey, TaskPriority, TaskStatus } from "@jarvis/shared";
import type { Task, TaskPriority as TaskPriorityType, TaskStatus as TaskStatusType } from "@jarvis/shared";
import type { ActorRef, ResourceScope } from "@jarvis/shared";
import { evaluateSecurityAction, type SecurityIdentity, type SecurityAction } from "../security/security-policy.js";
import type { LockService } from "../security/security-policy.js";
import type { AgentRegistry } from "../agents/agent-registry.js";

export interface TaskCreateInput { readonly title: string; readonly description?: string; readonly priority: TaskPriorityType; readonly assignedAgentId?: string; readonly clientId?: string; readonly projectId?: string; readonly dueDate?: string; }
export interface TaskUpdateInput { readonly title?: string; readonly description?: string; readonly priority?: TaskPriorityType; readonly dueDate?: string; readonly clientId?: string; readonly projectId?: string; }
export interface TaskRepository { get(id: string): Task | undefined; list(): readonly Task[]; save(task: Task): Task; }
export class InMemoryTaskRepository implements TaskRepository {
  private readonly records = new Map<string, Task>();
  get(id: string): Task | undefined { return this.records.get(id); }
  list(): readonly Task[] { return [...this.records.values()]; }
  save(task: Task): Task { this.records.set(task.id, task); return task; }
}

const actorId = (actor: ActorRef): string | undefined => actor.userId ?? actor.agentId ?? actor.serviceId;
const taskScope = (taskId: string): ResourceScope => ({ module: "tasks", resourceType: "task", resourceIds: [taskId] });

export class TaskService {
  constructor(private readonly agents: AgentRegistry, private readonly locks: LockService, private readonly repository: TaskRepository = new InMemoryTaskRepository(), private readonly policyVersion = "phase1") {}

  private authorize(action: SecurityAction, actor: SecurityIdentity, approvalSatisfied = false): void {
    const decision = evaluateSecurityAction(action, actor, this.locks, this.policyVersion, approvalSatisfied);
    if (decision.decision === "APPROVAL_REQUIRED") throw new Error("APPROVAL_REQUIRED");
    if (decision.decision !== "SAFE") throw new Error(decision.code);
  }

  private ensureAssignedAgent(id: string | undefined): void { if (id) this.agents.assertUsable(id); }
  get(id: string): Task | undefined { return this.repository.get(id); }
  list(): readonly Task[] { return this.repository.list(); }

  create(input: TaskCreateInput, actor: SecurityIdentity): Task {
    if (!input.title.trim()) throw new Error("TITLE_REQUIRED");
    this.ensureAssignedAgent(input.assignedAgentId);
    const id = randomUUID();
    this.authorize({ action: "task.create", permission: PermissionKey.CREATE, module: "tasks", resourceType: "task", resourceId: id, resourceScope: taskScope(id), risk: input.assignedAgentId ? AgentRiskLevel.MEDIUM : AgentRiskLevel.LOW }, actor);
    const timestamp = new Date().toISOString();
    return this.repository.save({ id, title: input.title, description: input.description, priority: input.priority, status: TaskStatus.TODO, assignedAgentId: input.assignedAgentId, clientId: input.clientId, projectId: input.projectId, dueDate: input.dueDate, createdBy: actorId(actor.actor) ?? "unknown", createdAt: timestamp, updatedAt: timestamp });
  }

  update(id: string, input: TaskUpdateInput, actor: SecurityIdentity): Task {
    const current = this.repository.get(id);
    if (!current) throw new Error("TASK_NOT_FOUND");
    this.ensureAssignedAgent(current.assignedAgentId);
    this.authorize({ action: "task.update", permission: PermissionKey.UPDATE, module: "tasks", resourceType: "task", resourceId: id, resourceScope: taskScope(id), risk: AgentRiskLevel.MEDIUM }, actor);
    return this.repository.save({ ...current, ...input, id, updatedAt: new Date().toISOString() });
  }

  assign(id: string, assignedAgentId: string | undefined, actor: SecurityIdentity): Task {
    const current = this.repository.get(id);
    if (!current) throw new Error("TASK_NOT_FOUND");
    this.ensureAssignedAgent(assignedAgentId);
    this.authorize({ action: "task.assign", permission: PermissionKey.UPDATE, module: "tasks", resourceType: "task", resourceId: id, resourceScope: taskScope(id), agentId: assignedAgentId, risk: AgentRiskLevel.MEDIUM }, actor);
    return this.repository.save({ ...current, assignedAgentId, updatedAt: new Date().toISOString() });
  }

  changeStatus(id: string, status: TaskStatusType, actor: SecurityIdentity, approvalSatisfied = false): Task {
    const current = this.repository.get(id);
    if (!current) throw new Error("TASK_NOT_FOUND");
    if (!Object.values(TaskStatus).includes(status)) throw new Error("INVALID_TASK_STATUS");
    const risk = status === TaskStatus.COMPLETED || status === TaskStatus.CANCELLED ? AgentRiskLevel.MEDIUM : AgentRiskLevel.LOW;
    this.authorize({ action: "task.status", permission: PermissionKey.UPDATE, module: "tasks", resourceType: "task", resourceId: id, resourceScope: taskScope(id), risk }, actor, approvalSatisfied);
    return this.repository.save({ ...current, status, updatedAt: new Date().toISOString() });
  }
}
