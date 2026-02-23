"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight, GitBranch, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  url: z
    .url("Please enter a valid URL")
    .regex(
      /github\.com\/[\w-]+\/[\w.-]+/,
      "Only GitHub repositories are supported currently"
    ),
});

export function AnalysisInput() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // 2. Trigger the Backend (via Server Action or API)
      const response = await fetch("/api/repos/analyze", {
        method: "POST",
        body: JSON.stringify({ url: values.url }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to start analysis");

      toast.success("Analysis started! Redirecting to console...");

      // 3. Redirect to the live console we built earlier
      router.push(`/dashboard/repo/${data.repoId}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative group">
        <div className="relative flex items-center">
          <GitBranch className="absolute left-4 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            {...form.register("url")}
            placeholder="https://github.com/username/repository"
            className="pl-12 pr-32 h-14 text-base rounded-2xl border-2 focus-visible:ring-offset-0 shadow-lg transition-all"
            disabled={isLoading}
          />
          <div className="absolute right-2">
            <Button
              type="submit"
              disabled={isLoading || !form.formState.isValid}
              className="rounded-xl h-10 px-6 font-semibold"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Analyze <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Validation Error Message */}
        {form.formState.errors.url && (
          <div className="absolute -bottom-8 left-2 flex items-center gap-1.5 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4" />
            {form.formState.errors.url.message}
          </div>
        )}
      </form>

      <p className="mt-10 text-xs text-muted-foreground text-center italic">
        Note: Large repositories may take a few minutes to map completely.
      </p>
    </div>
  );
}
