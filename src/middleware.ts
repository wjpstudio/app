import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes — splash page and auth API only
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/dashboard-data") ||
    pathname.startsWith("/api/dashboard-auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/pfp") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Everything else requires auth
  const auth = request.cookies.get("dashboard_auth");
  if (!auth || auth.value !== "1") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
