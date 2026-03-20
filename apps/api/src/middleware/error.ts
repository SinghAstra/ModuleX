import { ApiResponse, logError } from "@repo/common";
import { NextFunction, Request, Response } from "express";
import { env } from "../env.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logError(err);
  const statusCode = err.status || 500;
  const response: ApiResponse<null> = {
    success: false,
    error:
      env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message || "An unexpected error occurred",
    code: err.code || "INTERNAL_ERROR",
  };

  res.status(statusCode).json(response);
};
