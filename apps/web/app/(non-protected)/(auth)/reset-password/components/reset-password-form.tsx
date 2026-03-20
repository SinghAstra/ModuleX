"use client";

import { resetPasswordAction } from "@/actions/auth/reset-password";
import { CustomInput } from "@/components/reusable/custom-input";
import { PasswordStrengthCheck } from "@/components/reusable/password-strength-check";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/lib/routes";
import { ResetPasswordFormData, resetPasswordSchema } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
  });

  const passwordValue = watch("password");

  const onSubmitPassword = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true);
    try {
      const performPasswordReset = async () => {
        const response = await resetPasswordAction({
          tokenId: token,
          password: data.password,
        });

        if (!response.success) {
          throw new Error(response.error);
        }

        router.push(ROUTES.AUTH.SIGN_IN);
        return response.data.message;
      };

      toast.promise(performPasswordReset(), {
        loading: "Updating password...",
        success: (message: string) => message,
        error: (err: Error) => err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitPassword)}
      className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-600"
    >
      <div className="flex flex-col gap-0.5">
        <CustomInput
          label="New Password"
          id="password"
          type="password"
          placeholder="Enter your new password"
          PrefixIcon={Lock}
          isPassword={true}
          {...register("password")}
          onFocus={() => setShowPasswordStrength(true)}
          error={errors.password?.message}
        />

        {showPasswordStrength && (
          <PasswordStrengthCheck password={passwordValue} />
        )}
      </div>

      <Separator />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full transition-all duration-300 cursor-pointer rounded"
      >
        {isSubmitting ? (
          <>
            <Loader className="w-5 h-5 animate-spin mr-2" />
            Resetting...
          </>
        ) : (
          "Set New Password"
        )}
      </Button>
    </form>
  );
}
