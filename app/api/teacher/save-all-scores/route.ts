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

    for (const s of students) {
      const { nationalId, className, result } = s;

      const total =
        (result.midterm1 || 0) +
        (result.finalTerm || 0) +
        (result.exercises || 0) +
        (result.classActivities || 0) +
        (result.homework || 0);

      await Grade.findOneAndUpdate(
        { nationalId, subject },
        { ...result, total, subject, className, nationalId, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
