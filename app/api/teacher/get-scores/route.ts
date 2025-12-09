import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Grade from "@/models/Grade";

export const dynamic = 'force-dynamic';


export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const className = searchParams.get("className");
    const subject = searchParams.get("subject");
    const nationalId = searchParams.get("nationalId"); // 🔹 new filter for one student

    // Case 1: Fetch by student nationalId
    if (nationalId) {
      const grades = await Grade.find({ nationalId });
      return NextResponse.json({ grades });
    }

    // Case 2: Fetch by class + subject
    if (!className || !subject) {
      return NextResponse.json(
        { error: "Missing className or subject" },
        { status: 400 }
      );
    }

    const grades = await Grade.find({ className, subject });
    return NextResponse.json({ grades });
  } catch (err: any) {
    console.error("Error fetching grades:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
