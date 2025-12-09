import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Student from '@/models/Student';

export const dynamic = 'force-dynamic';



type Result = {
  subject: string;
  midterm1?: number;
  finalTerm?: number;
  exercises?: number;
  classActivities?: number;
  homework?: number;
};

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
   await connectDB();

  try {
    const studentId = params.id;
    const { subject, field, value } = await req.json();

    const student = await Student.findById(studentId);
    if (!student) return NextResponse.json({ message: 'Student not found' }, { status: 404 });

    // Ensure results array exists
    if (!student.results) student.results = [];

    // Find existing result for this subject
    let result = (student.results as Result[]).find((r) => r.subject === subject);
    if (!result) {
      const newResult: Result = { subject };
      student.results.push(newResult);
      result = newResult;
    }

    (result as any)[field] = value;

    await student.save();
    return NextResponse.json({ message: 'Grade updated', student });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'حدث خطأ', status: 500 });
  }
}
