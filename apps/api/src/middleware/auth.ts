import { ApiResponse, logError } from "@repo/common";
import { NextFunction, Request, Response } from "express";
import { getToken } from "next-auth/jwt";
import { env } from "../env.js";

export const authMiddleware = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
) => {
  try {
    const token = await getToken({
      req,
      secret: env.AUTH_SECRET,
    });

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: No session found",
        code: "UNAUTHORIZED",
      });
    }

    req.userId = token.sub;
    next();
  } catch (error) {
    logError(error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error during authentication",
      code: "AUTH_ERROR",
    });
  }
};
