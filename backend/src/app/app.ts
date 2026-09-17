import express, { type Express } from "express";
import { config } from "./config.js";
import { requestContext } from "../shared/middleware/request-context.js";
import { errorHandler, notFoundHandler } from "../shared/middleware/error-handler.js";
import { healthRouter } from "../modules/health/health.router.js";

export const createApp = (): Express => {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "1mb" }));
  app.use(requestContext);
  app.use(`${config.apiPrefix}/health`, healthRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};
