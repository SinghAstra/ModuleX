"use client";

import { ErrorFallback } from "@/components/reusable/error-fallback";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RepoError({ error, reset }: ErrorProps) {
  return (
    <ErrorFallback
      pageName="Repository"
      error={error}
      reset={reset}
      fallbackHref="/dashboard"
    />
  );
}
