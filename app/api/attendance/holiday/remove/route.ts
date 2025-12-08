import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Attendance from "@/models/Attendance";
import Holiday from "@/models/Holiday";

connectDB();

export async function POST(req: Request) {
  try {
    const { schoolYear, month, year, day } = await req.json();
    if (!schoolYear || !month || !year || !day) {
      return NextResponse.json({ error: "Missing holiday fields" }, { status: 400 });
    }

    await Holiday.deleteOne({ schoolYear, month, year, day });

    const allRecords = await Attendance.find({ month, year, schoolYear });
    for (const rec of allRecords) {
      rec.holidays = (rec.holidays || []).filter((h: number) => h !== day);
      await rec.save();
    }

    return NextResponse.json({ message: `Holiday removed from day ${day}` });
  } catch (err) {
    console.error("POST Holiday Remove Error:", err);
    return NextResponse.json({ error: "Error removing holiday" }, { status: 500 });
  }
}
