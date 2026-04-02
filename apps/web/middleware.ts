import { NextResponse } from "next/server";

// Token is stored in localStorage (cross-domain setup).
// Route protection is handled client-side in each admin layout.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/((?!login).*)"],
};
