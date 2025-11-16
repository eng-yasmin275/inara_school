// app/api/grades/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Grade from "@/models/Grade";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const nationalId = searchParams.get("nationalId");

    if (!nationalId) {
      return NextResponse.json({ error: "Missing nationalId" }, { status: 400 });
    }

    const grades = await Grade.find({ nationalId });
    // map to include total for each subject if not already
    const mapped = grades.map((g) => ({
      subject: g.subject,
      total: g.total,
    }));

    return NextResponse.json({ grades: mapped });
  } catch (err: any) {
    console.error("Error fetching grades:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
