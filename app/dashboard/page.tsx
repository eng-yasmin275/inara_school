import Link from "next/link";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const token = cookies().get("token")?.value;

  if (!token) redirect("/login"); // no token → redirect

  try {
    jwt.verify(token, process.env.JWT_SECRET || "secret"); // token must be valid
  } catch {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <form method="POST" action="/api/auth/logout">
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
            تسجيل الخروج
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/students" className="p-6 bg-white rounded shadow hover:shadow-lg transition">
          إدارة الطلاب
        </Link>
        <Link href="/dashboard/employees" className="p-6 bg-white rounded shadow hover:shadow-lg transition">
          إدارة الموظفين
        </Link>
        <Link href="/dashboard/attendance" className="p-6 bg-white rounded shadow hover:shadow-lg transition">
          إدارة الحضور
        </Link>
        <Link href="/dashboard/supplies" className="p-6 bg-white rounded shadow hover:shadow-lg transition">
          إدارة المستلزمات
        </Link>
      </div>
    </div>
  );
}
