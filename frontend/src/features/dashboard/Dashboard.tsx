import { useEffect, useState } from "react";
import type { DashboardSummary } from "@jarvis/shared/contracts";
import { apiClient, ApiClientError } from "../../services/api-client.js";
import { DashboardHeader } from "./DashboardHeader.js";
import { SystemStatus } from "./SystemStatus.js";
import { AttentionPanel } from "./AttentionPanel.js";
import { OperationalSummary } from "./OperationalSummary.js";
import { AgentActivity } from "./AgentActivity.js";
import { TaskSummary } from "./TaskSummary.js";
import { SecuritySummary } from "./SecuritySummary.js";
import { RecentActivity } from "./RecentActivity.js";
import { AIUsageSummary } from "./AIUsageSummary.js";
import { QuickActions } from "./QuickActions.js";

export interface DashboardData {
  readonly systemStatus?: "Operational" | "Degraded" | "Unavailable";
  readonly activeAgents?: number;
  readonly pendingApprovals?: number;
  readonly tasks?: { readonly todo?: number; readonly inProgress?: number; readonly waitingApproval?: number; readonly failed?: number };
  readonly lockState?: "ACTIVE" | "INACTIVE";
  readonly recentActivity?: readonly { readonly timestamp: string; readonly actor: string; readonly action: string; readonly result: string }[];
}

type LoadState = { status: "loading" } | { status: "ready"; data: DashboardSummary } | { status: "unavailable"; message: string } | { status: "error"; message: string };

export const Dashboard = (): React.ReactElement => {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const load = async () => {
    setState({ status: "loading" });
    try { setState({ status: "ready", data: await apiClient<DashboardSummary>("/dashboard") }); }
    catch (error) {
      const message = error instanceof ApiClientError && error.status >= 500 ? "Dashboard data is temporarily unavailable." : "Dashboard data is not connected yet.";
      setState({ status: "unavailable", message });
    }
  };
  useEffect(() => { void load(); }, []);
  return <div className="dashboard"><DashboardHeader onRefresh={load} loading={state.status === "loading"} />{state.status === "loading" ? <DashboardSkeleton /> : state.status === "error" ? <ErrorState message={state.message} onRetry={load} /> : state.status === "unavailable" ? <UnavailableState message={state.message} /> : <DashboardContent data={state.data} />}</div>;
};

const DashboardContent = ({ data }: { data: DashboardSummary }): React.ReactElement => <>
  <div className="dashboard-primary"><SystemStatus status={data.systemStatus} /><AttentionPanel approvals={data.pendingApprovals} failed={data.tasks?.failed} /><OperationalSummary data={data} /></div>
  <div className="dashboard-secondary"><TaskSummary tasks={data.tasks} /><AgentActivity count={data.activeAgents} /><SecuritySummary lockState={data.lockState} /><RecentActivity events={data.recentActivity} /><AIUsageSummary /></div>
  <QuickActions />
</>;

const DashboardSkeleton = (): React.ReactElement => <div className="dashboard-loading" aria-label="Loading dashboard" aria-busy="true"><span className="skeleton skeleton-wide" /><div className="skeleton-grid"><span className="skeleton" /><span className="skeleton" /><span className="skeleton" /></div><span className="skeleton skeleton-large" /></div>;
const UnavailableState = ({ message }: { message: string }): React.ReactElement => <div className="state-panel"><p className="eyebrow">Dashboard</p><h2>Data unavailable</h2><p className="muted">{message}</p></div>;
const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }): React.ReactElement => <div className="state-panel state-error"><p className="eyebrow">Dashboard</p><h2>We couldn't load this view</h2><p className="muted">{message}</p><button className="button button-secondary" onClick={onRetry}>Try again</button></div>;

