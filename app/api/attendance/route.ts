import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Attendance from "@/models/Attendance";
import Holiday from "@/models/Holiday";


// ------------------- GET Attendance -------------------
export async function GET(req: Request) {
   await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "";
    const className = searchParams.get("className") || "";
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));
    const schoolYear = searchParams.get("schoolYear") || "";

    if (!month || !year || !schoolYear) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Fetch attendance
    const records = await Attendance.find({ category, className, month, year, schoolYear });

    const data: { [personId: string]: boolean[] } = {};
    records.forEach(rec => {
      data[rec.personId] = rec.attendance;
    });

    // Fetch all holidays for this month/year/schoolYear
    const holidaysRecords = await Holiday.find({ month, year, schoolYear });
    const holidays = holidaysRecords.map(h => h.day);

    return NextResponse.json({ attendance: data, holidays });
  } catch (err) {
    console.error("GET Attendance Error:", err);
    return NextResponse.json({ error: "Error fetching attendance" }, { status: 500 });
  }
}

// ------------------- POST Save All Attendance -------------------
export async function POST(req: Request) {
    await connectDB();

  try {
    const body = await req.json();
    const { schoolYear, month, year, attendanceData, holidays } = body;

    if (!month || !year || !schoolYear || !attendanceData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get today for blocking future attendance
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    for (const personId in attendanceData) {
      let attArray: boolean[] = attendanceData[personId];
      
      // Block future days
      attArray = attArray.map((val, idx) => {
        const day = idx + 1;
        if (year === currentYear && month === currentMonth && day > currentDay) {
          return false; // cannot mark future attendance
        }
        return val;
      });

      await Attendance.findOneAndUpdate(
        { personId, month, year, schoolYear },
        { attendance: attArray, holidays },
        { upsert: true, new: true }
      );
    }

    // Update holidays table
    if (holidays && holidays.length > 0) {
      for (const day of holidays) {
        const exists = await Holiday.findOne({ day, month, year, schoolYear });
        if (!exists) {
          await Holiday.create({ day, month, year, schoolYear });
        }
      }
    }

    return NextResponse.json({ message: "Attendance saved successfully" });
  } catch (err) {
    console.error("POST SaveAll Error:", err);
    return NextResponse.json({ error: "Error saving attendance" }, { status: 500 });
  }
}

// // ------------------- POST Add Holiday -------------------
// export async function POST_HOLIDAY(req: Request) {
//   try {
//     const { schoolYear, month, year, day } = await req.json();
//     if (!schoolYear || !month || !year || !day) {
//       return NextResponse.json({ error: "Missing holiday fields" }, { status: 400 });
//     }

//     // Add to Holiday table
//     const exists = await Holiday.findOne({ schoolYear, month, year, day });
//     if (!exists) {
//       await Holiday.create({ schoolYear, month, year, day });
//     }

//     // Apply holiday to all attendance records
//     const allRecords = await Attendance.find({ month, year, schoolYear });
//     for (const rec of allRecords) {
//       if (!rec.holidays.includes(day)) {
//         rec.holidays.push(day);
//         await rec.save();
//       }
//     }

//     return NextResponse.json({ message: `Holiday added on day ${day}` });
//   } catch (err) {
//     console.error("POST Holiday Error:", err);
//     return NextResponse.json({ error: "Error adding holiday" }, { status: 500 });
//   }
// }

// // ------------------- POST Remove Holiday -------------------
// export async function POST_HOLIDAY_REMOVE(req: Request) {
//   try {
//     const { schoolYear, month, year, day } = await req.json();
//     if (!schoolYear || !month || !year || !day) {
//       return NextResponse.json({ error: "Missing holiday fields" }, { status: 400 });
//     }

//     // Remove from Holiday table
//     await Holiday.deleteOne({ schoolYear, month, year, day });

//     // Remove from all attendance records
//     const allRecords = await Attendance.find({ month, year, schoolYear });
//     for (const rec of allRecords) {
//     rec.holidays = (rec.holidays || []).filter((h: number) => h !== day);
//       await rec.save();
//     }

//     return NextResponse.json({ message: `Holiday removed from day ${day}` });
//   } catch (err) {
//     console.error("POST Holiday Remove Error:", err);
//     return NextResponse.json({ error: "Error removing holiday" }, { status: 500 });
//   }
// }
