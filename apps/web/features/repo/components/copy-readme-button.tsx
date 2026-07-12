"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CopyReadmeButton({
  textToCopy,
}: {
  textToCopy: string | null;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!textToCopy) {
      toast.error("No README content to copy!");
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);

      setIsCopied(true);
      toast.success("README copied to clipboard!");

      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
      toast.error("Failed to copy to clipboard. Please try manually.");
    }
  };

  return (
    <Button
      onClick={handleCopy}
      type="button"
      variant="ghost"
      size="icon"
      title="Copy Readme"
      aria-label="Copy Readme"
      className="rounded-full text-muted-foreground hover:text-foreground border bg-card/50 hover:bg-card/70 size-7 sm:size-8 disabled:opacity-40"
    >
      {isCopied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}
