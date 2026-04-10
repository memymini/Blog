"use client";

import { useRef } from "react";
import type { PostMedia } from "@repo/types";
import { updateMedia } from "@/lib/api/admin";
import { cn } from "@/lib/utils";
import { useResizeDrag } from "@/lib/hooks/useResizeDrag";

interface MediaItemProps {
  item: PostMedia;
  postId: number;
  onWidthChange: (id: number, width: number) => void;
  onDelete: (id: number) => void;
}

export function MediaItem({ item: m, postId, onWidthChange, onDelete }: MediaItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = m.width ?? 100;

  async function handleResizeEnd(finalW: number) {
    try {
      await updateMedia(postId, m.id, { width: finalW });
    } catch {
      onWidthChange(m.id, m.width ?? 100);
    }
  }

  const { isResizing, onResizeStart } = useResizeDrag(
    containerRef,
    (w) => onWidthChange(m.id, w),
    handleResizeEnd,
  );

  return (
    <div className="relative group flex justify-center">
      <div ref={containerRef} className="relative" style={{ width: `${width}%` }}>
        {/* Width badge */}
        <div className="absolute top-2 left-2 z-10 bg-primary-900 rounded-sm px-1.5 py-0.5 text-white text-[11px] font-mono tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
          {width}%
        </div>

        {m.type === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.url} alt={m.alt_text ?? ""} className="block w-full rounded-sm" />
        )}
        {m.type === "video" && (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video src={m.url} controls className="block w-full rounded-sm" />
        )}
        {m.type === "embed" && (
          <iframe src={m.url} className="w-full aspect-video" allowFullScreen title={m.alt_text ?? "Embedded content"} />
        )}

        {/* Right-edge resize handle */}
        <div
          onMouseDown={onResizeStart}
          className={cn(
            "absolute right-0 top-0 h-full w-4 flex items-center justify-center cursor-col-resize",
            "opacity-0 transition-opacity group-hover:opacity-100",
            isResizing && "opacity-100",
          )}
        >
          <div className="w-1 h-12 bg-primary-900/70 rounded-full hover:bg-primary-900 transition-colors" />
        </div>

        {m.caption && (
          <p className="mt-2 text-caption text-secondary-400 text-center">{m.caption}</p>
        )}

        <button
          type="button"
          onClick={() => onDelete(m.id)}
          className="absolute top-2 right-6 bg-primary-900/70 text-white text-caption px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
