const KNOWN_IMAGE_HOSTS = ["supabase.co", "supabase.in", "picsum.photos"] as const;

/** Returns true if `src` can be routed through the Next.js image optimizer (domain is in remotePatterns). */
export function canOptimizeImage(src: string): boolean {
  try {
    const { hostname } = new URL(src);
    return KNOWN_IMAGE_HOSTS.some((d) => hostname === d || hostname.endsWith(`.${d}`));
  } catch {
    return true; // relative path — always optimizable
  }
}

function toBase64(str: string): string {
  if (typeof window === "undefined") return Buffer.from(str).toString("base64");
  return window.btoa(str);
}

const shimmerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="9"><rect width="16" height="9" fill="#E8E4DC"/></svg>`;

/** Tiny warm-gray SVG data URL used as `blurDataURL` while images load. */
export const blurPlaceholder = `data:image/svg+xml;base64,${toBase64(shimmerSvg)}`;
