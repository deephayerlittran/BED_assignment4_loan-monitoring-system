import { Request, Response, NextFunction } from "express";
import AppError from "./AppError";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err?.statusCode || 500;
  const response = {
    status: "error",
    message: err?.message || "Internal Server Error",
    timestamp: new Date().toISOString()
  };
  // dev: include stack
  if (process.env.NODE_ENV !== "production") (response as any).stack = err.stack;
  res.status(statusCode).json(response);
}
