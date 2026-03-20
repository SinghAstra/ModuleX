"use client";

import { signUpAction } from "@/actions/auth/sign-up";
import { CustomInput } from "@/components/reusable/custom-input";
import { PasswordStrengthCheck } from "@/components/reusable/password-strength-check";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleLogo } from "@/lib/svg";
import { type SignUpFormValues, signUpSchema } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { logError } from "@repo/common";
import { Check, Loader, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function SignUpForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [mailSent, setMailSent] = useState(false);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const passwordValue = watch("password");

  const onSubmit = async (data: SignUpFormValues) => {
    const performSignUp = async () => {
      const response = await signUpAction(data);

      if (!response.success) {
        throw new Error(response.error);
      }

      setMailSent(true);
      return response.data.message;
    };

    await toast.promise(performSignUp(), {
      loading: "Creating your account...",
      success: (message: string) => message,
      error: (err: Error) => err.message,
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn("google", {
        redirect: true,
      });
    } catch (error) {
      logError(error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Button
        type="button"
        className="w-full rounded-lg tracking-wide relative cursor-pointer transition-all duration-300 ease-in-out active:scale-[0.98] py-2 px-3"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
        variant="outline"
      >
        {isGoogleLoading ? (
          <>
            <Loader className="size-4 animate-spin mr-2" />
            Wait ...
          </>
        ) : (
          <>
            <GoogleLogo className="mr-2" />
            <span className="text-center tracking-wide">
              Continue with Google
            </span>
          </>
        )}
      </Button>

      <div className="relative flex gap-4 items-center">
        <span className="flex-1 flex items-center">
          <Separator />
        </span>
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
          Or
        </span>
        <span className="flex-1 flex items-center">
          <Separator />
        </span>
      </div>

      {mailSent ? (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-600">
          <div className="bg-card border border-border rounded-lg p-6 flex gap-4 items-start shadow-sm hover:shadow-md hover:border-foreground/20 transition-all duration-300 ease-in-out">
            <div className="bg-primary/10 p-2 rounded-md shrink-0">
              <Check className="size-4 text-primary" strokeWidth={2} />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground tracking-tight">
                Check your email to confirm
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We&apos;ve sent a confirmation link to{" "}
                <strong className="font-medium">{watch("email")}</strong>.
                Please check your inbox to confirm your account before signing
                in. The confirmation link expires in 10 minutes.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <CustomInput
            label="Email"
            id="email"
            type="email"
            placeholder="attorney@firm.com"
            required
            PrefixIcon={Mail}
            {...register("email")}
            error={errors.email?.message}
          />

          <div className="space-y-2">
            <CustomInput
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
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

          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90 font-medium transition-all duration-300 ease-in-out rounded-lg active:scale-[0.98] py-2 px-3 mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader className="size-4 animate-spin mr-2" strokeWidth={2} />
                Wait ...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
