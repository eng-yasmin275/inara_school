import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/utils/connectDB';
import Employee from '@/models/Employee';

connectDB();

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // Find employee with username
    const employee = await Employee.findOne({ username });
    if (!employee) 
      return NextResponse.json({ message: 'المستخدم غير موجود' }, { status: 401 });

    // Compare password directly (plain text)
    if (!employee.password || employee.password !== password) {
      return NextResponse.json({ message: 'كلمة المرور خاطئة' }, { status: 401 });
    }

    // Generate JWT
    const secret = process.env.JWT_SECRET || 'defaultsecret';
    const token = jwt.sign(
      {
        id: employee._id,
        username: employee.username,
        role: employee.role,
        classes: employee.classes,
        subjects: employee.subjects,
      },
      secret,
      { expiresIn: '1d' }
    );

    return NextResponse.json({ token, role: employee.role });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 });
  }
}
