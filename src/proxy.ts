import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE, getLocaleFromHeaders, isValidLocale } from "@/lib/i18n";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip internal paths, API routes, and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files like favicon.ico
  ) {
    return NextResponse.next();
  }

  // Check if the pathname starts with a supported locale
  const segments = pathname.split("/");
  const firstSegment = segments[1];
  const pathnameHasLocale = isValidLocale(firstSegment);

  // If no locale in pathname, redirect with detected locale
  if (!pathnameHasLocale) {
    const acceptLanguage = request.headers.get("accept-language");
    const locale = getLocaleFromHeaders(acceptLanguage);
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(newUrl);
  }

  // Auth check for admin routes
  const lang = firstSegment;
  const restPath = "/" + segments.slice(2).join("/");

  let response = NextResponse.next();

  if (restPath.startsWith("/admin") && restPath !== "/admin/login") {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: request.nextUrl.protocol === "https:",
    });

    if (!token) {
      const loginUrl = new URL(`/${lang}/admin/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      response = NextResponse.redirect(loginUrl);
    }
  }

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/((?!_next|api|favicon\\.ico).*)"],
};
