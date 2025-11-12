import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Employee from "@/models/Employee";

// Connect to DB
connectDB();

// Update employee
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();

    // Ensure subjects & classes are arrays even if empty
    if (!Array.isArray(data.subjects)) data.subjects = [];
    if (!Array.isArray(data.classes)) data.classes = [];

    const employee = await Employee.findByIdAndUpdate(
      params.id,
      { ...data }, // spread all fields
      { new: true, runValidators: true } // make sure schema validators run
    );

    if (!employee) {
      return NextResponse.json(
        { error: "لم يتم العثور على الموظف" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء التحديث" },
      { status: 500 }
    );
  }
}

// Delete employee
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const deleted = await Employee.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json(
        { error: "لم يتم العثور على الموظف" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "تم حذف الموظف" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء الحذف" },
      { status: 500 }
    );
  }
}
