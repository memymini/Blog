"use client";

import Link from "next/link";
import { H2, Body } from "@/components/ui/typography";
import { Button } from "@/components/ui";

export default function PostError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <H2>Post unavailable</H2>
      <Body className="text-secondary-500 max-w-sm">
        We couldn&apos;t load this post. It may have been removed or is temporarily unavailable.
      </Body>
      <div className="flex gap-3">
        <Button variant="outline" onClick={reset}>
          Try again
        </Button>
        <Link href="/">
          <Button variant="ghost">Go home</Button>
        </Link>
      </div>
    </div>
  );
}
