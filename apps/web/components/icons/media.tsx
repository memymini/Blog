type Align = "left" | "center" | "right";

export function AlignIcon({ align, size = 12 }: { align: Align; size?: number }) {
  if (align === "left") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="14" y2="12" />
        <line x1="3" y1="18" x2="17" y2="18" />
      </svg>
    );
  }
  if (align === "center") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="7" y1="12" x2="17" y2="12" />
        <line x1="5" y1="18" x2="19" y2="18" />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="10" y1="12" x2="21" y2="12" />
      <line x1="7" y1="18" x2="21" y2="18" />
    </svg>
  );
}
