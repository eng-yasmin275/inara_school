import { NextResponse } from "next/server";

export function middleware(req: any) {
  const adminToken = req.cookies.get("token")?.value; // for admin
  const teacherToken = req.cookies.get("teacherToken")?.value; // for teacher
  const pathname = req.nextUrl.pathname;

  // Protect Admin Dashboard
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/?authMessage=admin", req.url));
    }
  }

  // Protect Teacher Dashboard
  if (pathname === "/teacher-dashboard" || pathname.startsWith("/teacher-dashboard/")) {
    if (!teacherToken) {
      return NextResponse.redirect(new URL("/?authMessage=teacher", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/dashboard", 
    "/teacher-dashboard/:path*", 
    "/teacher-dashboard"
  ],
};
