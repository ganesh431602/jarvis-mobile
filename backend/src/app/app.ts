import express, { type Express } from "express";
import { config } from "./config.js";
import { requestContext } from "../shared/middleware/request-context.js";
import { errorHandler, notFoundHandler } from "../shared/middleware/error-handler.js";
import { healthRouter } from "../modules/health/health.router.js";
import { globalRateLimiter } from "./rate-limit.js";

export const createApp = (): Express => {
  const app = express();

  app.disable("x-powered-by");

  app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin && config.corsOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Request-Id");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    }

    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    if (req.method === "OPTIONS") {
      if (!origin || !config.corsOrigins.includes(origin)) {
        return res.status(403).end();
      }
      return res.status(204).end();
    }

    next();
  });

  app.use(globalRateLimiter);
  app.use(express.json({ limit: "1mb" }));
  app.use(requestContext);
  app.use(`${config.apiPrefix}/health`, healthRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
