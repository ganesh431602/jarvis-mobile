import { Router } from "express";
import { AgentRegistry } from "../agents/agent-registry.js";
import { TaskService } from "../tasks/task-service.js";
import { InMemoryLockService } from "../security/security-policy.js";
import { createDashboardReadService } from "./dashboard-read-service.js";

const agents = new AgentRegistry();
const locks = new InMemoryLockService();
const tasks = new TaskService(agents, locks);
const dashboard = createDashboardReadService({ agents, tasks, locks });

export const dashboardRouter = Router();

dashboardRouter.get("/", (_request, response) => {
  response.json({
    success: true,
    data: dashboard.getSummary(),
  });
});