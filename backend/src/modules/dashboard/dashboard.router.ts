import { Router } from "express";
import { getDashboardSummary } from "./dashboard-read-service.js";

export const dashboardRouter = Router();

dashboardRouter.get("/", (_request, response) => {
  response.json({
    success: true,
    data: getDashboardSummary(),
  });
});