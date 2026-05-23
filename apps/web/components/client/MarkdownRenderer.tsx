import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import type { ComponentPropsWithoutRef } from "react";
import { canOptimizeImage } from "@/lib/image";

interface MarkdownRendererProps {
  content: string;
}

function MarkdownImage({ src, alt }: ComponentPropsWithoutRef<"img">) {
  if (!src || typeof src !== "string") return null;
  return (
    <Image
      src={src}
      alt={alt ?? ""}
      width={0}
      height={0}
      sizes="(max-width: 768px) 100vw, 720px"
      className="w-full h-auto"
      unoptimized={!canOptimizeImage(src)}
    />
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{ img: MarkdownImage }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
