"use client";

import { H2, Body } from "@/components/ui/typography";
import { Button } from "@/components/ui";

export default function PostsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <H2>Failed to load posts</H2>
      <Body className="text-secondary-500 max-w-sm">
        We couldn&apos;t fetch the post list. Check your connection and try again.
      </Body>
      <Button variant="outline" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
