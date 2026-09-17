export interface User { id: string; email: string; displayName?: string; role: UserRole; status: "ACTIVE" | "DISABLED"; createdAt: ISODateTime; updatedAt: ISODateTime; }
export interface Session { id: string; userId: string; issuedAt: ISODateTime; expiresAt: ISODateTime; revokedAt?: ISODateTime; requestId?: string; }
import type { ISODateTime } from "../../types/security.js";
import { UserRole } from "../../enums/index.js";
