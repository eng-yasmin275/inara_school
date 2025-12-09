import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Student from "@/models/Student";


export async function GET() {
   await connectDB();

  try {
    const students = await Student.find();
    return NextResponse.json(students);
  } catch (err) {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function POST(req: Request) {
     await connectDB();
  
  try {
    const data = await req.json();

    // Explicitly pick all fields from the form
    const newStudent = await Student.create({
      nationalId: data.nationalId || "",
      name: data.name || "",
      className: data.className || "",
      birthdate: data.birthdate || "",
      email: data.email || "",
      phone: data.phone || "",
      notes: data.notes || "",
      absence: data.absence || 0,
      results: data.results || []
    });

    return NextResponse.json(newStudent);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إضافة الطالب" },
      { status: 500 }
    );
  }
}


export async function PUT(req: Request) {
      await connectDB();

  try {
    const data = await req.json();
    const { _id, ...fields } = data;

    if (!_id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    // Update the student
    const updatedStudent = await Student.findByIdAndUpdate(
      _id,
      {
        nationalId: fields.nationalId || "",
        name: fields.name || "",
        className: fields.className || "",
        birthdate: fields.birthdate || "",
        email: fields.email || "",
        phone: fields.phone || "",
        notes: fields.notes || "",
        absence: fields.absence || 0,
        results: fields.results || []
      },
      { new: true } // return the updated document
    );

    if (!updatedStudent) {
      return NextResponse.json({ error: "الطالب غير موجود" }, { status: 404 });
    }

    return NextResponse.json(updatedStudent);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تعديل الطالب" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request) {
      await connectDB();

  try {
    const data = await req.json();
    const { _id } = data;

    if (!_id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    const deleted = await Student.findByIdAndDelete(_id);

    if (!deleted) {
      return NextResponse.json({ error: "الطالب غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ message: "تم حذف الطالب بنجاح" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف الطالب" },
      { status: 500 }
    );
  }
}
