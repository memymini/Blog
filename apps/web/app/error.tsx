"use client";

import { useEffect } from "react";
import { H2, Body } from "@/components/ui/typography";
import { Button } from "@/components/ui";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to an error reporting service in production
    if (process.env.NODE_ENV !== "development") return;
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <H2>Something went wrong</H2>
      <Body className="text-secondary-500 max-w-sm">
        An unexpected error occurred. Please try again.
      </Body>
      <Button variant="outline" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
