"use client";

import { H2, Body } from "@/components/ui/typography";
import { Button } from "@/components/ui";

export default function LangError({ reset }: { error: Error; reset: () => void }) {
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
