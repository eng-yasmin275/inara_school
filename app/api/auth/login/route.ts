// ===== app/api/auth/login/route.ts =====
import { NextRequest, NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/utils/connectDB';
import User from '@/models/User';

connectDB(); // اتأكد من الاتصال بقاعدة البيانات

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: 'المستخدم غير موجود' }, { status: 401 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ message: 'كلمة المرور خاطئة' }, { status: 401 });

      // ✅ هذا هو السطر الجديد لتوليد التوكن
    const secret = process.env.JWT_SECRET || 'defaultsecret';
    const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '1d' });

    return NextResponse.json({ token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 });
  }
}
