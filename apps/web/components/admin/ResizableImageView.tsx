"use client";

import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Align = "left" | "center" | "right";

const ALIGN_MARGIN: Record<Align, string> = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
};

export function ResizableImageView({ node, updateAttributes, selected }: NodeViewProps) {
  const src = node.attrs.src as string;
  const alt = (node.attrs.alt as string) ?? "";
  const width = (node.attrs.width as number | null) ?? 100;
  const align = (node.attrs.align as Align) ?? "center";

  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const startX = useRef(0);
  const startW = useRef(0);

  const onResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      startX.current = e.clientX;
      startW.current = containerRef.current?.offsetWidth ?? 0;
      setIsResizing(true);

      function onMove(e: MouseEvent) {
        const parentW = containerRef.current?.parentElement?.offsetWidth ?? 1;
        const delta = e.clientX - startX.current;
        const raw = ((startW.current + delta) / parentW) * 100;
        const clamped = Math.round(Math.min(100, Math.max(20, raw)));
        updateAttributes({ width: clamped });
      }

      function onUp() {
        setIsResizing(false);
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      }

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [updateAttributes],
  );

  return (
    <NodeViewWrapper className="relative my-4 flex flex-col" style={{ alignItems: { left: "flex-start", center: "center", right: "flex-end" }[align] }}>

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
          <span className="text-white text-[11px] font-mono px-1 tabular-nums">{width}%</span>
        </div>
      )}

      {/* Image + resize handle */}
      <div
        ref={containerRef}
        className="relative block"
        style={{ width: `${width}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
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

function AlignIcon({ align }: { align: Align }) {
  if (align === "left") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="14" y2="12" />
        <line x1="3" y1="18" x2="17" y2="18" />
      </svg>
    );
  }
  if (align === "center") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="7" y1="12" x2="17" y2="12" />
        <line x1="5" y1="18" x2="19" y2="18" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="10" y1="12" x2="21" y2="12" />
      <line x1="7" y1="18" x2="21" y2="18" />
    </svg>
  );
}
