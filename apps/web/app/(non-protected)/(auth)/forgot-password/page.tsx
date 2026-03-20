"use client";

import { OTPProvider } from "@/components/component-x/otp";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import { useState } from "react";
import AuthNavbar from "../components/auth-navbar";
import { ForgotPasswordEmailForm } from "./components/forgot-password-email-form";
import { ForgotPasswordOTPForm } from "./components/forgot-password-otp-form";

export default function ForgotPasswordPage() {
  const [codeSent, setCodeSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleEmailSuccess = (email: string) => {
    setUserEmail(email);
    setCodeSent(true);
  };

  return (
    <div className="h-screen bg-background flex flex-col w-full">
      <div className="px-4 py-4 md:px-6 md:py-6 shrink-0">
        <AuthNavbar />
      </div>

      <div className="flex justify-center items-start px-4 py-8 md:py-12">
        <div className="w-full max-w-md mx-auto">
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-balance text-foreground">
                {codeSent ? "Enter reset code" : "Forgot your password ?"}
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {codeSent
                  ? "Enter the code we sent to your email"
                  : "Enter your email and we'll send you a code to reset the password"}
              </p>
            </div>

            {!codeSent ? (
              <ForgotPasswordEmailForm onSuccess={handleEmailSuccess} />
            ) : (
              <>
                <OTPProvider>
                  <ForgotPasswordOTPForm userEmail={userEmail} />
                </OTPProvider>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCodeSent(false)}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out mt-4"
                >
                  Change email
                </Button>
              </>
            )}

            <p className="text-muted-foreground text-sm text-center leading-relaxed mt-6">
              Already have an account?{" "}
              <Link
                href={ROUTES.AUTH.SIGN_IN}
                className="text-foreground hover:text-foreground/70 underline underline-offset-4 transition-colors duration-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
