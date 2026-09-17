import type { IntegrationProvider, IntegrationStatus } from "../../enums/index.js";
import type { ISODateTime, Metadata } from "../../types/security.js";
/** Configuration is non-secret metadata only; never credentials or tokens. */
export interface Integration { id: string; provider: IntegrationProvider; status: IntegrationStatus; configuration?: Metadata; lastError?: string; ownerId?: string; connectedAt?: ISODateTime; createdAt: ISODateTime; updatedAt: ISODateTime; }
