import { env } from "@/env";
import { authOptions } from "@/lib/auth-options";
import { logError } from "@/lib/log-error";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/response-utils";
import {
  ApiResponse,
  ImportRepoResponse,
  INTERNAL_AUTH_KEYS,
  InternalJwtPayload,
} from "@understand-x/shared";
import axios from "axios";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return createErrorResponse("Unauthorized: Please sign in again.", 401);
    }

    const body = await req.json();
    if (!body.repoUrl) {
      return createErrorResponse("Repository URL is required.", 400);
    }

    const JWT_SECRET = env.JWT_SECRET;
    const API_URL = env.NEXT_PUBLIC_API_URL;

    const payload: InternalJwtPayload = {
      userId: session.user.id,
      purpose: INTERNAL_AUTH_KEYS.PURPOSE,
    };

    const internalToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "60s" });

    const { data: expressData } = await axios.post<
      ApiResponse<ImportRepoResponse>
    >(`${API_URL}/api/repos/import`, body, {
      headers: {
        Authorization: `Bearer ${internalToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("expressData is ", expressData);

    if (expressData.success) {
      return createSuccessResponse<ImportRepoResponse>(
        expressData.data,
        expressData.message,
        202
      );
    }

    return createErrorResponse(
      expressData.message,
      expressData.statusCode,
      expressData.errors
    );
  } catch (error) {
    logError(error);
    return createErrorResponse("Internal Server Error", 500);
  }
}
