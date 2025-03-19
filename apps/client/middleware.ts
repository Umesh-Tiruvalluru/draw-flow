import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token");
  const url = req.nextUrl.clone();

  if (token && (url.pathname === "/login" || url.pathname === "/signup")) {
    url.pathname = "/dashboard"; // Redirect logged-in user to dashboard
    return NextResponse.redirect(url);
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    url.pathname = "/login"; // Redirect unauthenticated user to login
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Define routes for middleware to apply
export const config = {
  matcher: ["/", "/login", "/signup", "/dashboard/:path*"],
};
