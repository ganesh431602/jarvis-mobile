export enum AgentStatus { ACTIVE = "ACTIVE", INACTIVE = "INACTIVE", SUSPENDED = "SUSPENDED" }
export enum AgentRiskLevel { LOW = "LOW", MEDIUM = "MEDIUM", HIGH = "HIGH", CRITICAL = "CRITICAL" }
export enum PermissionKey { READ = "read", CREATE = "create", UPDATE = "update", DELETE = "delete", PUBLISH = "publish", SEND = "send", DEPLOY = "deploy", FINANCIAL_ACTION = "financial_action", CREDENTIAL_READ = "credential_read", CREDENTIAL_WRITE = "credential_write", INTEGRATION_CONNECT = "integration_connect", INTEGRATION_DISCONNECT = "integration_disconnect", SECURITY_POLICY_CHANGE = "security_policy_change", LOCK_CONTROL = "lock_control" }
export enum ApprovalRiskLevel { LOW = "LOW", MEDIUM = "MEDIUM", HIGH = "HIGH", CRITICAL = "CRITICAL" }
export enum ApprovalStatus { PENDING = "PENDING", APPROVED = "APPROVED", REJECTED = "REJECTED", EXPIRED = "EXPIRED", CANCELLED = "CANCELLED" }
export enum TaskPriority { LOW = "LOW", MEDIUM = "MEDIUM", HIGH = "HIGH", CRITICAL = "CRITICAL" }
export enum TaskStatus { TODO = "TODO", IN_PROGRESS = "IN_PROGRESS", WAITING_APPROVAL = "WAITING_APPROVAL", COMPLETED = "COMPLETED", FAILED = "FAILED", CANCELLED = "CANCELLED" }
export enum ClientStatus { ACTIVE = "ACTIVE", INACTIVE = "INACTIVE", ARCHIVED = "ARCHIVED" }
export enum ProjectStatus { PLANNED = "PLANNED", ACTIVE = "ACTIVE", COMPLETED = "COMPLETED", ARCHIVED = "ARCHIVED" }
export enum IntegrationProvider { GITHUB = "GITHUB", GMAIL = "GMAIL", YOUTUBE = "YOUTUBE", INSTAGRAM = "INSTAGRAM", LINKEDIN = "LINKEDIN", CLOUD_STORAGE = "CLOUD_STORAGE", PAYMENT_SYSTEM = "PAYMENT_SYSTEM" }
export enum IntegrationStatus { NOT_CONNECTED = "NOT_CONNECTED", CONNECTED = "CONNECTED", DISCONNECTED = "DISCONNECTED", ERROR = "ERROR" }
export enum ActionDecision { SAFE = "SAFE", APPROVAL_REQUIRED = "APPROVAL_REQUIRED", BLOCKED = "BLOCKED" }
export enum AuditResult { SUCCESS = "SUCCESS", DENIED = "DENIED", FAILED = "FAILED" }
export enum UserRole { OWNER = "OWNER", ADMIN = "ADMIN", OPERATOR = "OPERATOR", VIEWER = "VIEWER" }
export enum EmergencyLockScope { GLOBAL = "GLOBAL", MODULE = "MODULE", AGENT = "AGENT", RESOURCE = "RESOURCE", ACTION = "ACTION" }
export enum EmergencyLockStatus { ACTIVE = "ACTIVE", INACTIVE = "INACTIVE" }
export type RiskLevel = AgentRiskLevel;
