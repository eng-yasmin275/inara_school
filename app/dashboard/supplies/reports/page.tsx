'use client';
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SuppliesReports() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/api/supplies/logs")
      .then(res => res.json())
      .then(data => setLogs(data));
  }, []);

  return (
    <div className="p-6">
      {/* العنوان مع زر العودة */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-blue-700">
          📘 تقارير المخزون
        </h1>

        {/* زر العودة */}
        <Link href="/dashboard/supplies">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            ← العودة
          </button>
        </Link>
      </div>

      {/* جدول التقارير */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">الصنف</th>
            <th className="p-2 border">الإجراء</th>
            <th className="p-2 border">الوصف</th>
            <th className="p-2 border">التاريخ</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log: any) => (
            <tr key={log._id}>
              <td className="p-2 border">{log.itemId?.name || "Deleted Item"}</td>
              <td className="p-2 border">{log.action}</td>
              <td className="p-2 border">{log.description}</td>
              <td className="p-2 border">{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
