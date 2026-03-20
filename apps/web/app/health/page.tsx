"use client";

import { getApiHealth, type HealthStatus } from "@/actions/health";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiResponse } from "@repo/common";
import { Activity, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function SmokeTestPage() {
  const [result, setResult] = useState<ApiResponse<HealthStatus> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    const data = await getApiHealth();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-border bg-card text-card-foreground">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
            <ShieldCheck className="text-primary w-7 h-7" />
            System Monitor
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Verifying connectivity between Vercel and Render
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Button
            onClick={handleCheck}
            disabled={loading}
            className="w-full h-12 text-lg transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Pinging Render...
              </>
            ) : (
              "Check API Health"
            )}
          </Button>

          {result && (
            <div
              className={`p-5 rounded-lg border transition-all ${
                result.success
                  ? "bg-secondary text-secondary-foreground border-border"
                  : "bg-destructive/10 text-destructive border-destructive/20"
              }`}
            >
              <div className="flex items-center justify-between mb-3 border-b pb-3">
                <span className="font-semibold text-card-foreground">
                  Status:
                </span>
                <Badge variant={result.success ? "default" : "destructive"}>
                  {result.success ? "Online" : "Offline"}
                </Badge>
              </div>

              {result.success ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-secondary-foreground">
                    <Activity size={18} className="shrink-0" />
                    <span className="text-sm font-medium leading-tight">
                      {result.data.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground pt-1 border-t">
                    API Uptime: {result.data.uptime.toFixed(2)} seconds
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-destructive">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span className="text-sm font-medium">{result.error}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
