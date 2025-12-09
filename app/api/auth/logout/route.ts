import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  // Use request origin, fallback to environment variable, fallback to "/"
  const origin = req.nextUrl?.origin || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const response = NextResponse.redirect(new URL("/?loggedOut=1", origin));

  // Clear the token cookie
  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
