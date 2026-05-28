"use client";

import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { cn } from "@/utils/utils";

export function MediaView({ node, selected }: NodeViewProps) {
  const type = node.type.name as "image" | "video";
  const src = node.attrs.src as string;
  const alt = (node.attrs.alt as string) ?? "";

  return (
    <NodeViewWrapper className="relative my-4 block">
      {type === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          draggable={false}
          className={cn(
            "block w-full rounded-sm select-none",
            selected && "ring-2 ring-primary-400 ring-offset-1",
          )}
        />
      ) : (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          src={src}
          controls
          className={cn(
            "block w-full rounded-sm",
            selected && "ring-2 ring-primary-400 ring-offset-1",
          )}
        />
      )}
    </NodeViewWrapper>
  );
}
