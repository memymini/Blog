import Link from "next/link";
import { H2, Body } from "@/components/ui/typography";
import { Button } from "@/components/ui";

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <H2>Page not found</H2>
      <Body className="text-secondary-500">
        This admin page doesn&apos;t exist.
      </Body>
      <Link href="/admin/posts">
        <Button variant="outline">Back to posts</Button>
      </Link>
    </div>
  );
}
