"use client";

import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { AlignIcon } from "@/components/icons";
import { useResizeDrag } from "@/lib/hooks/useResizeDrag";

type Align = "left" | "center" | "right";

const ALIGN_ITEMS: Record<Align, string> = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};

export function MediaView({ node, updateAttributes, selected }: NodeViewProps) {
  const type = node.type.name as "image" | "video";
  const src = node.attrs.src as string;
  const alt = (node.attrs.alt as string) ?? "";
  const width = (node.attrs.width as number | null) ?? 100;
  const align = ((node.attrs.align as Align) ?? "center") as Align;

  const containerRef = useRef<HTMLDivElement>(null);
  const { isResizing, onResizeStart } = useResizeDrag(
    containerRef,
    (w) => updateAttributes({ width: w }),
  );

  return (
    <NodeViewWrapper
      className="relative my-4 flex flex-col"
      style={{ alignItems: ALIGN_ITEMS[align] }}
    >
      {/* Floating toolbar — visible when selected */}
      {selected && (
        <div className="flex items-center gap-0.5 bg-primary-900 rounded-sm px-1 py-0.5 mb-1.5 shadow-md self-center">
          {(["left", "center", "right"] as Align[]).map((a) => (
            <button
              key={a}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                updateAttributes({ align: a });
              }}
              className={cn(
                "w-6 h-6 flex items-center justify-center text-white rounded-sm transition-colors",
                align === a ? "bg-white/25" : "hover:bg-white/10",
              )}
              title={`Align ${a}`}
            >
              <AlignIcon align={a} />
            </button>
          ))}
          <div className="w-px h-4 bg-white/30 mx-0.5" />
          <span className="text-white text-[11px] font-mono px-1 tabular-nums">
            {width}%
          </span>
        </div>
      )}

      {/* Media element + resize handle */}
      <div
        ref={containerRef}
        className="relative block"
        style={{ width: `${width}%` }}
      >
        {type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            draggable={false}
            className={cn(
              "block w-full rounded-sm select-none",
              selected && "ring-2 ring-primary-400 ring-offset-1",
              isResizing && "pointer-events-none",
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
              isResizing && "pointer-events-none",
            )}
          />
        )}

        {/* Right-edge resize handle */}
        <div
          onMouseDown={onResizeStart}
          className={cn(
            "absolute right-0 top-0 h-full w-4 flex items-center justify-center cursor-col-resize",
            "opacity-0 transition-opacity",
            (selected || isResizing) && "opacity-100",
          )}
        >
          <div className="w-1 h-12 bg-primary-900/70 rounded-full hover:bg-primary-900 transition-colors" />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
