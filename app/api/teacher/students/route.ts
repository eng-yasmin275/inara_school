import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Employee from "@/models/Employee";
import Student from "@/models/Student";
import jwt from "jsonwebtoken";

connectDB();

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "defaultsecret";

    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const teacher = await Employee.findById(decoded.id);
    if (!teacher) {
      return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
    }

    // Mapping between Arabic names and numeric class values
    const classMapping: Record<string, string> = {
      "صف أول": "1",
      "الصف الأول": "1",
      "صف ثاني": "2",
      "الصف الثاني": "2",
      "صف ثالث": "3",
      "الصف الثالث": "3",
      "صف رابع": "4",
      "الصف الرابع": "4",
      "صف خامس": "5",
      "الصف الخامس": "5",
      "صف سادس": "6",
      "الصف السادس": "6",
      "صف سابع": "7",
      "الصف السابع": "7",
      "صف ثامن": "8",
      "الصف الثامن": "8",
      "صف تاسع": "9",
      "الصف التاسع": "9",
    };

    // Convert teacher.classes safely to mapped strings
    const teacherClasses: string[] = Array.isArray(teacher.classes)
      ? teacher.classes
          .map((c: any) => {
            if (!c) return "";
            const cStr = c.toString().trim();
            // Map Arabic → numeric string (e.g., "الصف السادس" -> "6")
            return classMapping[cStr] || cStr;
          })
          .filter(Boolean)
      : [];

    // Convert teacher.subjects safely
    const teacherSubjects: string[] = Array.isArray(teacher.subjects)
      ? teacher.subjects
          .map((s: any) => (s ? s.toString().trim() : ""))
          .filter(Boolean)
      : [];

    // --- Handle query params ---
    const { searchParams } = new URL(req.url);
    const classNameStr = searchParams.get("class");
    const subject = searchParams.get("subject");

    let students = [];

    if (classNameStr && subject) {
      // Normalize the requested class (map Arabic to numeric)
      const mappedClass =
        classMapping[classNameStr.trim()] || classNameStr.trim();

      // If the teacher has that class (as a numeric string)
      if (!teacherClasses.includes(mappedClass) || !teacherSubjects.includes(subject)) {
        return NextResponse.json(
          { message: "You are not assigned to this class or subject" },
          { status: 403 }
        );
      }

      // Fetch students whose className matches the numeric string
      students = await Student.find({ className: mappedClass });
    }

    return NextResponse.json({ teacherClasses, teacherSubjects, students });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "حدث خطأ", status: 500 });
  }
}
