import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import type { ComponentPropsWithoutRef } from "react";

interface MarkdownRendererProps {
  content: string;
}

/** Custom <img> renderer: skips the element when src is missing or empty. */
function MarkdownImage({ src, alt, ...rest }: ComponentPropsWithoutRef<"img">) {
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt ?? ""} {...rest} />;
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
