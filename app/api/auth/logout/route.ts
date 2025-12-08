import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(new URL("/?loggedOut=1", "http://localhost:3000"));
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
