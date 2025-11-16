import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Attendance from "@/models/Attendance";

connectDB();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const className = searchParams.get("className") || "";
  const month = Number(searchParams.get("month"));
  const year = Number(searchParams.get("year"));

  if (!category || !month || !year) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const records = await Attendance.find({ category, className, month, year });
    const data: any = {};

    const holidays: number[] = [];

records.forEach((rec) => {
  data[rec.personId] = rec.attendance;

  (rec.holidays || []).forEach((h: number) => {
    if (typeof h === "number" && !Number.isNaN(h)) {
      if (!holidays.includes(h)) {
        holidays.push(h);
      }
    }
  });
});




    return NextResponse.json({ attendance: data, holidays });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error fetching attendance" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { personId, category, className, month, year, attendance, holidays } = data;

    if (!personId || !category || !month || !year || !attendance) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await Attendance.findOne({ personId, category, className, month, year });

    if (existing) {
      existing.attendance = attendance;
      existing.holidays = holidays;
      await existing.save();
      return NextResponse.json(existing);
    }

    const newRecord = await Attendance.create({
      personId,
      category,
      className,
      month,
      year,
      attendance,
      holidays,
    });

    return NextResponse.json(newRecord);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error saving attendance" }, { status: 500 });
  }
}
