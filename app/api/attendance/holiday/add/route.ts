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

    const exists = await Holiday.findOne({ schoolYear, month, year, day });
    if (!exists) await Holiday.create({ schoolYear, month, year, day });

    const allRecords = await Attendance.find({ month, year, schoolYear });
    for (const rec of allRecords) {
      if (!rec.holidays.includes(day)) {
        rec.holidays.push(day);
        await rec.save();
      }
    }

    return NextResponse.json({ message: `Holiday added on day ${day}` });
  } catch (err) {
    console.error("POST Holiday Add Error:", err);
    return NextResponse.json({ error: "Error adding holiday" }, { status: 500 });
  }
}
