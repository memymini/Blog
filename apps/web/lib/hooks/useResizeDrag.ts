"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Shared drag-resize logic for media components (MediaItem, MediaView).
 * Tracks horizontal mouse drag to compute a width percentage clamped to 20–100.
 *
 * @param containerRef - ref to the element whose offsetWidth is measured
 * @param onChange     - called on every mousemove with the updated clamped %
 * @param onResizeEnd  - optional, called once on mouseup with the final DOM-measured %
 */
export function useResizeDrag(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onChange: (width: number) => void,
  onResizeEnd?: (finalWidth: number) => void,
) {
  const startX = useRef(0);
  const startW = useRef(0);
  const [isResizing, setIsResizing] = useState(false);

  const onResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      startX.current = e.clientX;
      startW.current = containerRef.current?.offsetWidth ?? 0;
      setIsResizing(true);

      function clamp(raw: number) {
        return Math.round(Math.min(100, Math.max(20, raw)));
      }

      function onMove(ev: MouseEvent) {
        const parentW = containerRef.current?.parentElement?.offsetWidth ?? 1;
        const delta = ev.clientX - startX.current;
        const raw = ((startW.current + delta) / parentW) * 100;
        onChange(clamp(raw));
      }

      function onUp() {
        setIsResizing(false);
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);

        if (onResizeEnd && containerRef.current?.parentElement) {
          const parentW = containerRef.current.parentElement.offsetWidth;
          const finalRaw = (containerRef.current.offsetWidth / parentW) * 100;
          onResizeEnd(clamp(finalRaw));
        }
      }

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [containerRef, onChange, onResizeEnd],
  );

  return { isResizing, onResizeStart };
}
