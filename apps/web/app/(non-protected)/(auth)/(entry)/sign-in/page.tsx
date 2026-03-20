"use client";

import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import AuthNavbar from "../../components/auth-navbar";
import { SignInForm } from "./components/sign-in-form";

export default function SignInPage() {
  useEffect(() => {
    if (window.location.hash) {
      const params = new URLSearchParams(window.location.hash.substring(1));

      const errorDescription = params.get("error_description");
      const successMessage = params.get("message");

      setTimeout(() => {
        if (errorDescription) {
          toast.error(decodeURIComponent(errorDescription));
        } else if (successMessage) {
          toast.success(decodeURIComponent(successMessage));
        }
      });

      // Clear the URL hash so the toast doesn't show again on refresh
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return (
    <div className="flex flex-col gap-8 p-4 bg-muted/30 max-w-lg w-full h-screen overflow-auto mx-auto">
      <AuthNavbar />

      <div className="flex flex-col gap-6 sm:px-8 my-auto w-full">
        <SignInForm />

        <p className="text-muted-foreground text-sm text-center leading-relaxed">
          Don&apos;t have an account ?{" "}
          <Link
            href={ROUTES.AUTH.SIGN_UP}
            className="text-foreground hover:text-foreground/70 transition-all duration-300 ease-in-out border-b border-foreground hover:border-foreground/50"
          >
            Sign Up Now
          </Link>
        </p>
      </div>
    </div>
  );
}
