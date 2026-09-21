import express, { type Express } from "express";
import helmet from "helmet";
import { config } from "./config.js";
import { requestContext } from "../shared/middleware/request-context.js";
import { notFoundHandler } from "../shared/middleware/error-handler.js";
import { productionErrorHandler } from "../shared/middleware/production-error-handler.js";
import { requireJsonContentType, validateRequestBodySize } from "../shared/middleware/request-validation.js";
import { healthRouter } from "../modules/health/health.router.js";
import { globalRateLimiter } from "./rate-limit.js";
import { ssrfProtection } from "../shared/middleware/ssrf-protection.js";
import { securityRequestBoundary } from "../shared/middleware/security-request-boundary.js";

export const createApp = (): Express => {
  const app = express();

  app.disable("x-powered-by");

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          baseUri: ["'self'"],
          frameAncestors: ["'none'"],
          objectSrc: ["'none'"],
          formAction: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
        },
      },
      referrerPolicy: { policy: "no-referrer" },
    }),
  );

  app.use(securityRequestBoundary);

  app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin) {
      if (!config.corsOrigins.includes(origin)) {
        res.status(403).json({ error: "Origin not allowed." });
        return;
      }

      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Request-Id",
      );
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      );
    }

    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()",
    );

    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }

    next();
  });

  app.use(globalRateLimiter);
  app.use(requireJsonContentType);
  app.use(express.json({ limit: "1mb", strict: true }));
  app.use(validateRequestBodySize);
  app.use(ssrfProtection);
  app.use(requestContext);

  app.use(`${config.apiPrefix}/health`, healthRouter);
  app.use(notFoundHandler);
  app.use(productionErrorHandler);

  return app;
};
