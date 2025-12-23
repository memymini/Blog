import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse, type NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

//const languages = new Negotiator({ headers }).languages();
const locales = ["en", "ko"];
const defaultLocale = "en";

function getLocale(request: NextRequest) {
  const cookieLocale =
    request.cookies.get("NEXT_LOCALE")?.value ??
    request.cookies.get("locale")?.value;
  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as (typeof locales)[number];
  }
  const headers = Object.fromEntries(request.headers);
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

// 1. Initialize NextAuth
const { auth } = NextAuth(authConfig);

// 2. Export combined middleware
export default auth((req) => {
  // 3. Run I18n Middleware logic
  const { pathname } = req.nextUrl;

  // Skip I18n for internal paths or API
  if (
    pathname.includes(".") || // static files
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/admin") // Admin paths are handled by Auth Guard, no language prefix needed usually? Or do we want /en/admin?
  ) {
    if (pathname.startsWith("/admin")) {
      // Just allow through, Auth guard already ran in `auth` callback wrapper
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect if there is no locale
  const locale = getLocale(req);
  req.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(req.nextUrl);
});

export const config = {
  // Merge matchers: Match all except static files and images
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
