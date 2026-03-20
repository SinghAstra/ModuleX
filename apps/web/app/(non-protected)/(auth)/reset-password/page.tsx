"use client";

import { ROUTES } from "@/lib/routes";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AuthNavbar from "../components/auth-navbar";
import { ResetPasswordForm } from "./components/reset-password-form";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const urlToken = searchParams.get("token");

    if (urlToken) {
      setToken(urlToken);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    } else {
      if (!token) {
        toast.error("Invalid session. Please restart.");
        router.replace(ROUTES.AUTH.FORGOT_PASSWORD);
      }
    }
  }, [searchParams, router, token]);

  if (token === null) {
    return (
      <div className="h-screen bg-background flex flex-col p-4 w-full overflow-y-auto">
        <AuthNavbar />
        <div className="flex-1 flex justify-center items-center">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col p-4 w-full overflow-y-auto">
      <AuthNavbar />
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full max-w-md">
          <div className="space-y-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold text-foreground">
                Set New Password
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter your new, strong password. This will immediately replace
                your old one.
              </p>
            </div>

            <ResetPasswordForm token={token} />
          </div>
        </div>
      </div>
    </div>
  );
}
