import { ApiResponse } from "@repo/common";
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
    interface Response {
      json<T>(data: ApiResponse<T>): this;
    }
  }
}
