import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    // Accept JSON or Form POST
    let email, password;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      email = body.email;
      password = body.password;
    } else {
      const formData = await req.formData();
      email = formData.get("email")?.toString();
      password = formData.get("password")?.toString();
    }

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ error: "Wrong password" }, { status: 401 });

    const token = jwt.sign(
      { id: user._id, email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 24 * 60 * 60,
      sameSite: "lax",
      secure: false,
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
