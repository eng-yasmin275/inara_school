// app/api/students/[id]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Student from "@/models/Student";


// Update a student by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
   await connectDB();

  try {
    const data = await req.json();
    const studentId = params.id;

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        nationalId: data.nationalId || "",
        name: data.name || "",
        className: data.className || "",
        birthdate: data.birthdate || "",
        email: data.email || "",
        phone: data.phone || "",
        notes: data.notes || "",
        absence: data.absence || 0,
        results: data.results || [],
      },
      { new: true } // return updated doc
    );

    if (!updatedStudent) {
      return NextResponse.json({ error: "الطالب غير موجود" }, { status: 404 });
    }

    return NextResponse.json(updatedStudent);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "حدث خطأ أثناء تعديل الطالب" }, { status: 500 });
  }
}

// Delete a student by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
      await connectDB();

  try {
    const studentId = params.id;

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    const deleted = await Student.findByIdAndDelete(studentId);

    if (!deleted) {
      return NextResponse.json({ error: "الطالب غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ message: "تم حذف الطالب بنجاح" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "حدث خطأ أثناء حذف الطالب" }, { status: 500 });
  }
}
