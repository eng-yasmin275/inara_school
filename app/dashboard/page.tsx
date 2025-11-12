"use client";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">لوحة التحكم - المدير</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/students"
          className="p-6 bg-white rounded shadow hover:shadow-lg transition"
        >
          إدارة الطلاب
        </Link>

        <Link
          href="/dashboard/employees"
          className="p-6 bg-white rounded shadow hover:shadow-lg transition"
        >
          إدارة الموظفين
        </Link>

        <Link
          href="/dashboard/supplies"
          className="p-6 bg-white rounded shadow hover:shadow-lg transition"
        >
          إدارة المستلزمات
        </Link>
      </div>
    </div>
  );
}
