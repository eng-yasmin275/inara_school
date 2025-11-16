// ===== app/api/teacher/save-all-scores/route.ts =====
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Grade from "@/models/Grade";

export async function PUT(req: Request) {
  try {
    await connectDB();

    const { subject, students } = await req.json();

    if (!subject || !students) {
      return NextResponse.json({ error: "Missing subject or students" }, { status: 400 });
    }

    // Run all updates in parallel
    await Promise.all(
      students.map(async (s: any) => {
        const { nationalId, className, result } = s;

        if (!nationalId || !className || !result) return;

        const total =
          (result.midterm1 || 0) +
          (result.finalTerm || 0) +
          (result.exercises || 0) +
          (result.classActivities || 0) +
          (result.homework || 0);

        return Grade.findOneAndUpdate(
          { nationalId, subject },
          { ...result, total, subject, className, nationalId, updatedAt: new Date() },
          { upsert: true, new: true }
        );
      })
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
