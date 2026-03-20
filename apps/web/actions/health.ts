"use server";

import { ApiResponse } from "@repo/common";
import { env } from "../env";

export interface HealthStatus {
  status: string;
  uptime: number;
}

export async function getApiHealth(): Promise<ApiResponse<HealthStatus>> {
  try {
    const response = await fetch(`${env.API_URL}/api/health`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Backend returned ${response.status}: ${response.statusText}`,
      };
    }

    const result: ApiResponse<HealthStatus> = await response.json();
    return result;
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Could not connect to API",
      code: "FETCH_FAILED",
    };
  }
}
