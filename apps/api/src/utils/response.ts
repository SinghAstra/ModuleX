import { ApiResponse } from "@repo/common";
import { Response } from "express";

export const sendResponse = <T>(res: Response, data: T, status = 200) => {
  const body: ApiResponse<T> = {
    success: true,
    data,
  };
  return res.status(status).json(body);
};

export const sendError = (
  res: Response,
  message: string,
  status = 500,
  code?: string
) => {
  const body: ApiResponse<null> = {
    success: false,
    error: message,
    code,
  };
  return res.status(status).json(body);
};
