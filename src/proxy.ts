import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/auth/admin-session";

function getLoginUrl(request: NextRequest) {
  const loginUrl = new URL("/admin/login", request.url);
  return loginUrl;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(getLoginUrl(request));
  }

  const session = await verifyAdminSessionToken(token);

  if (!session) {
    return NextResponse.redirect(getLoginUrl(request));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
