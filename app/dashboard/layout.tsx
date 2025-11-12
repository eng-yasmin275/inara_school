import React from 'react';
import Link from 'next/link';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
return (
<div className="min-h-screen flex">
<aside className="w-64 bg-white p-4 shadow h-screen">
<h3 className="font-bold mb-4">لوحة التحكم</h3>
<nav className="flex flex-col gap-2">
<Link href="/dashboard/students" className="p-2 rounded hover:bg-gray-100">الطلاب</Link>
<Link href="/dashboard/employees" className="p-2 rounded hover:bg-gray-100">الموظفين</Link>
<Link href="/dashboard/supplies" className="p-2 rounded hover:bg-gray-100">المستلزمات</Link>
</nav>
</aside>
<main className="flex-1 p-6 bg-gray-50">{children}</main>
</div>
);
}