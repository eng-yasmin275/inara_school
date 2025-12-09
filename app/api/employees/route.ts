import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Employee from "@/models/Employee";


// Get all employees
export async function GET() {
   await connectDB();

  try {
    const employees = await Employee.find();
    return NextResponse.json(employees);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "حدث خطأ أثناء جلب الموظفين" }, { status: 500 });
  }
}

// Add a new employee
export async function POST(req: Request) {
   await connectDB();
  
  try {
    const data = await req.json();

    // Ensure subjects and classes are arrays
    const employeeData = {
      ...data,
      subjects: Array.isArray(data.subjects) ? data.subjects : [],
      classes: Array.isArray(data.classes) ? data.classes : [],
    };

    const newEmployee = await Employee.create(employeeData);
    return NextResponse.json(newEmployee);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "حدث خطأ أثناء إضافة الموظف" }, { status: 500 });
  }
}
