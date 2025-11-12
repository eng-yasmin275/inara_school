import 'dotenv/config'; // يقوم بتحميل متغيرات البيئة من .env
import connectDB from '../utils/connectDB.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

console.log('MONGO_URI =', process.env.MONGO_URI); // تحقق من قراءة المتغير

const createAdmin = async () => {
  await connectDB();

  const email = 'admin@example.com';
  const password = '123456';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new User({ email, password: hashedPassword });
  await admin.save();

  console.log('تم إنشاء المدير بنجاح!');
  process.exit();
};

createAdmin();
