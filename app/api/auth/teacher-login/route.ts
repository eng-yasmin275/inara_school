import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/utils/connectDB';
import Employee from '@/models/Employee';


export async function POST(req: NextRequest) {
  await connectDB(); // Important to await DB connection

  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'يرجى إدخال اسم المستخدم وكلمة المرور' }, { status: 400 });
    }

    const teacher = await Employee.findOne({ username });
    if (!teacher) return NextResponse.json({ message: 'المستخدم غير موجود' }, { status: 401 });

    if (!teacher.password || teacher.password !== password)
      return NextResponse.json({ message: 'كلمة المرور خاطئة' }, { status: 401 });

    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign({ id: teacher._id, username: teacher.username }, secret, { expiresIn: '1d' });

    // Set HTTP-only cookie
    const response = NextResponse.json({ message: 'تم تسجيل الدخول', token });
    response.cookies.set({
      name: 'teacherToken',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (err) {
    console.error('Teacher login error:', err);
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 });
  }
}
