import { type NextFunction, type Request, type Response } from "express";

export const requireJsonContentType = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    const contentType = req.headers["content-type"] ?? "";

    if (!contentType.toLowerCase().startsWith("application/json")) {
      res.status(415).json({
        error: "Unsupported media type. Expected application/json.",
      });
      return;
    }
  }

  next();
};

export const validateRequestBodySize = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.body !== undefined && req.body !== null && typeof req.body !== "object") {
    res.status(400).json({
      error: "Request body must be a JSON object.",
    });
    return;
  }

  next();
};
