"use client";

import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import AuthNavbar from "../../components/auth-navbar";
import { SignUpForm } from "./components/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="flex flex-col gap-8 p-4 bg-muted/30 max-w-lg w-full h-screen overflow-y-auto mx-auto">
      <AuthNavbar />

      <div className="flex flex-col gap-8 sm:px-8 my-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight">
            Get started
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Create a new account
          </p>
        </div>

        <SignUpForm />

        <p className="text-muted-foreground text-sm text-center leading-relaxed">
          Have an account?{" "}
          <Link
            href={ROUTES.AUTH.SIGN_IN}
            className="border-b border-foreground hover:border-foreground/50 text-foreground hover:text-foreground/70 transition-all duration-300 ease-in-out font-medium"
          >
            Sign In Now
          </Link>
        </p>
      </div>
    </div>
  );
}
