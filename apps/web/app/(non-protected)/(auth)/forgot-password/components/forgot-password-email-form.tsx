"use client";

import { forgotPasswordAction } from "@/actions/auth/forgot-password";
import { CustomInput } from "@/components/reusable/custom-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  type ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  onSuccess: (email: string) => void;
}

export function ForgotPasswordEmailForm({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
  });

  const onSubmitEmail = async (data: ForgotPasswordFormData) => {
    const performForgotPassword = async () => {
      const response = await forgotPasswordAction(data.email);
      if (!response.success) {
        throw new Error(response.error);
      }
      onSuccess(data.email);
      return response.data.message;
    };

    toast.promise(performForgotPassword(), {
      loading: "Sending reset code...",
      success: (message: string) => message,
      error: (err: Error) => err.message,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-6">
      <CustomInput
        label="Email"
        id="email"
        type="email"
        placeholder="you@example.com"
        PrefixIcon={Mail}
        {...register("email")}
        error={errors.email?.message}
      />
      <Separator />
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full transition-all duration-300 ease-in-out active:scale-[0.98] py-2 px-3"
      >
        {isSubmitting ? (
          <>
            <Loader className="size-4 animate-spin mr-2" />
            Sending...
          </>
        ) : (
          "Send reset code"
        )}
      </Button>
    </form>
  );
}
