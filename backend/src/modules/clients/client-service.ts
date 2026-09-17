import { randomUUID } from "node:crypto";
import { ClientStatus, ProjectStatus, PermissionKey } from "@jarvis/shared";
import type { Client, Project } from "@jarvis/shared";
import type { SecurityIdentity } from "../security/security-policy.js";
import type { LockService } from "../security/security-policy.js";
import type { AgentRegistry } from "../agents/agent-registry.js";

export interface ClientCreateInput {
  readonly name: string;
  readonly company?: string;
  readonly notes?: string;
}

export interface ClientUpdateInput {
  readonly name?: string;
  readonly company?: string;
  readonly notes?: string;
  readonly status?: ClientStatus;
}

export interface ProjectCreateInput {
  readonly clientId: string;
  readonly name: string;
  readonly description?: string;
}

export interface ProjectUpdateInput {
  readonly name?: string;
  readonly description?: string;
  readonly status?: ProjectStatus;
}

export interface ClientRepository {
  getClient(id: string): Client | undefined;
  listClients(): readonly Client[];
  saveClient(client: Client): Client;
}

export interface ProjectRepository {
  getProject(id: string): Project | undefined;
  listProjectsByClient(clientId: string): readonly Project[];
  saveProject(project: Project): Project;
}

export class InMemoryClientRepository implements ClientRepository {
  private readonly records = new Map<string, Client>();
  getClient(id: string): Client | undefined { return this.records.get(id); }
  listClients(): readonly Client[] { return [...this.records.values()]; }
  saveClient(client: Client): Client { this.records.set(client.id, client); return client; }
}

export class InMemoryProjectRepository implements ProjectRepository {
  private readonly records = new Map<string, Project>();
  getProject(id: string): Project | undefined { return this.records.get(id); }
  listProjectsByClient(clientId: string): readonly Project[] { return [...this.records.values()].filter((project) => project.clientId === clientId); }
  saveProject(project: Project): Project { this.records.set(project.id, project); return project; }
}

const nowIso = (): string => new Date().toISOString();

export class ClientService {
  constructor(
    private readonly clients: ClientRepository = new InMemoryClientRepository(),
    private readonly projects: ProjectRepository = new InMemoryProjectRepository(),
    private readonly lockService: LockService,
    private readonly agents: AgentRegistry,
  ) {}

  private authorize(actor: SecurityIdentity, permission: PermissionKey, resourceType: string, resourceId?: string): void {
    const action = { action: `client.${resourceType}`, permission, resourceType, resourceId, risk: undefined, resourceScope: { module: "clients", resourceType, resourceIds: resourceId ? [resourceId] : undefined } };
    const decision = { decision: "SAFE" } as any;
    if (!actor.permissions?.includes(permission)) throw new Error("PERMISSION_DENIED");
    if (this.lockService.isBlocked(action)) throw new Error("EMERGENCY_LOCK_ACTIVE");
  }

  getClient(id: string): Client | undefined { return this.clients.getClient(id); }
  listClients(): readonly Client[] { return this.clients.listClients(); }

  createClient(input: ClientCreateInput, actor: SecurityIdentity): Client {
    this.authorize(actor, PermissionKey.CREATE, "client");
    const timestamp = nowIso();
    const client: Client = { id: randomUUID(), name: input.name, company: input.company, status: ClientStatus.ACTIVE, notes: input.notes, createdBy: actor.actor.userId ?? actor.actor.agentId ?? actor.actor.serviceId ?? "system", createdAt: timestamp, updatedAt: timestamp };
    return this.clients.saveClient(client);
  }

  updateClient(id: string, patch: ClientUpdateInput, actor: SecurityIdentity): Client {
    const current = this.clients.getClient(id);
    if (!current) throw new Error("CLIENT_NOT_FOUND");
    this.authorize(actor, PermissionKey.UPDATE, "client", id);
    const updated: Client = { ...current, ...patch, updatedAt: nowIso() };
    return this.clients.saveClient(updated);
  }

  createProject(input: ProjectCreateInput, actor: SecurityIdentity): Project {
    const client = this.clients.getClient(input.clientId);
    if (!client) throw new Error("CLIENT_NOT_FOUND");
    this.authorize(actor, PermissionKey.CREATE, "project");
    const timestamp = nowIso();
    const project: Project = { id: randomUUID(), clientId: input.clientId, name: input.name, description: input.description, status: ProjectStatus.PLANNED, createdAt: timestamp, updatedAt: timestamp };
    return this.projects.saveProject(project);
  }

  getProject(id: string): Project | undefined { return this.projects.getProject(id); }
  listProjectsByClient(clientId: string): readonly Project[] { return this.projects.listProjectsByClient(clientId); }

  updateProject(id: string, patch: ProjectUpdateInput, actor: SecurityIdentity): Project {
    const current = this.projects.getProject(id);
    if (!current) throw new Error("PROJECT_NOT_FOUND");
    this.authorize(actor, PermissionKey.UPDATE, "project", id);
    const updated: Project = { ...current, ...patch, updatedAt: nowIso() };
    return this.projects.saveProject(updated);
  }
}
