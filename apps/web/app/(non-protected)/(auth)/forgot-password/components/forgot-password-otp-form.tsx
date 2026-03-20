"use client";

import { verifyResetCodeAction } from "@/actions/auth/verify-reset-code";
import { OTPGroup, useOTP } from "@/components/component-x/otp";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/routes";
import { Loader, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function ForgotPasswordOTPForm({ userEmail }: { userEmail: string }) {
  const { values } = useOTP();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const otpLength = values.filter((v) => v).length;
  const isOTPComplete = otpLength === 6;

  const onSubmitCode = async () => {
    setIsSubmitting(true);
    try {
      const performCodeVerification = async () => {
        const response = await verifyResetCodeAction({
          email: userEmail,
          code: values.join(""),
        });

        if (!response.success) {
          throw new Error(response.error);
        }

        const resetTokenId = response.data.resetTokenId;

        router.push(`${ROUTES.AUTH.RESET_PASSWORD}?token=${resetTokenId}`);

        return response.data.message;
      };

      await toast.promise(performCodeVerification(), {
        loading: "Verifying code...",
        success: (message: string) => message,
        error: (err: Error) => err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isOTPComplete) onSubmitCode();
      }}
      className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-600"
    >
      <div className="bg-card border rounded-lg p-4 flex gap-3 items-start shadow-sm">
        <div className="bg-primary/10 p-2 rounded-md shrink-0">
          <Mail className="size-4 text-primary" />
        </div>
        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="font-medium text-sm text-foreground">
            Check your email
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed wrap-break-word">
            We've sent a reset code to{" "}
            <span className="font-medium text-foreground">{userEmail}</span>.
            The code expires in 10 minutes.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Reset Code
        </Label>
        <div className="flex justify-center">
          <OTPGroup />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!isOTPComplete || isSubmitting}
        className="w-full transition-all duration-300 ease-in-out active:scale-[0.98] py-2 px-3"
      >
        {isSubmitting ? (
          <>
            <Loader className="size-4 animate-spin mr-2" />
            Verifying...
          </>
        ) : (
          "Verify code"
        )}
      </Button>
    </form>
  );
}
