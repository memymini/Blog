"use client";

import { useRef, useState } from "react";
import type { PostMedia } from "@repo/types";
import { updateMedia } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

interface MediaItemProps {
  item: PostMedia;
  postId: number;
  onWidthChange: (id: number, width: number) => void;
  onDelete: (id: number) => void;
}

export function MediaItem({ item: m, postId, onWidthChange, onDelete }: MediaItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startW = useRef(0);
  const [isResizing, setIsResizing] = useState(false);
  const width = m.width ?? 100;

  function onResizeStart(e: React.MouseEvent) {
    e.preventDefault();
    startX.current = e.clientX;
    startW.current = containerRef.current?.offsetWidth ?? 0;
    setIsResizing(true);

    function onMove(ev: MouseEvent) {
      const parentW = containerRef.current?.parentElement?.offsetWidth ?? 1;
      const delta = ev.clientX - startX.current;
      const raw = ((startW.current + delta) / parentW) * 100;
      const clamped = Math.round(Math.min(100, Math.max(20, raw)));
      onWidthChange(m.id, clamped);
    }

    async function onUp() {
      setIsResizing(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      const finalW =
        containerRef.current && containerRef.current.parentElement
          ? Math.round(
              Math.min(
                100,
                Math.max(
                  20,
                  (containerRef.current.offsetWidth /
                    containerRef.current.parentElement.offsetWidth) *
                    100,
                ),
              ),
            )
          : width;
      try {
        await updateMedia(postId, m.id, { width: finalW });
      } catch {
        onWidthChange(m.id, m.width ?? 100);
      }
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

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
