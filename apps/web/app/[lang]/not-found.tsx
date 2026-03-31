import Link from "next/link";
import { Display, Body } from "@/components/ui/typography";
import { Button } from "@/components/ui";

export default function LangNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <Display as="p" className="text-muted-300">
        404
      </Display>
      <Body className="text-secondary-500 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist.
      </Body>
      <Link href="/ko/posts">
        <Button variant="outline">Go home</Button>
      </Link>
    </div>
  );
}
