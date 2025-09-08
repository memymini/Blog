import { NextResponse, NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

let headers = { "accept-language": "en-US,en;q=0.5" };
let languages = new Negotiator({ headers }).languages();
let locales = ["en", "ko"];
let defaultLocale = "ko";

match(languages, locales, defaultLocale);

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
  const cookieLocale =
    request.cookies.get("NEXT_LOCALE")?.value ??
    request.cookies.get("locale")?.value;
  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as (typeof locales)[number];
  }
  // 2) Accept-Language negotiation
  // NextRequest headers are iterable; convert to plain object for Negotiator
  const headers = Object.fromEntries(request.headers);
  const languages = new Negotiator({ headers }).languages();

  // 3) Match against supported locales, fallback to default
  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  if (/\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next();
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
