"use client";

import { CustomInput } from "@/components/reusable/custom-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/lib/routes";
import { GoogleLogo } from "@/lib/svg";
import { type SignInFormValues, signInSchema } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function SignInForm() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const callbackUrl = ROUTES.DASHBOARD;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: SignInFormValues) => {
    const performLogin = async () => {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Invalid credentials");
      }

      router.push(callbackUrl);
      return "Welcome back!";
    };

    const promise = performLogin();

    toast.promise(promise, {
      loading: "Verifying credentials...",
      success: (message: string) => `${message}`,
      error: (err: Error) => `${err.message}`,
    });

    await promise;
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn("google", {
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error("Google sign in failed:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Sign in to your account
        </p>
      </div>

      <Button
        type="button"
        className="w-full rounded-lg tracking-wide relative cursor-pointer transition-all duration-300 ease-in-out active:scale-[0.98]"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
        variant="outline"
      >
        {isGoogleLoading ? (
          <>
            <Loader className="size-4 animate-spin mr-2" />
            Wait...
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

      <div className="relative flex items-center gap-2">
        <span className="flex-1">
          <Separator />
        </span>
        <span className="text-foreground/60 text-xs uppercase tracking-wider">
          Or
        </span>
        <span className="flex-1">
          <Separator />
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

        <CustomInput
          label="Password"
          id="password"
          type="password"
          placeholder="••••••••"
          required
          PrefixIcon={Lock}
          isPassword={true}
          {...register("password")}
          error={errors.password?.message}
          rightLabel={
            <Link
              href={ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-xs text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out"
            >
              Forgot Password?
            </Link>
          }
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90 font-medium transition-all duration-300 ease-in-out active:scale-[0.98] rounded-lg mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader className="size-4 animate-spin mr-2" />
              Wait...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </div>
  );
}
