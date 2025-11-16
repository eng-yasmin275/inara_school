// ===== app/page.tsx (Home Page - Fajr Logo Opposite Title + Gallery Hover Effect + Teacher Login) =====
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-blue-50 to-white p-6">
      {/* Header */}
      <header className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between py-6 px-4 md:px-0">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg overflow-hidden">
            <Image src="/schoollogo.png" alt="شعار المدرسة" width={64} height={64} className="object-cover" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700">نظام إدارة المدرسة</h1>
        </div>

        {/* Login Buttons */}
        <div className="mt-4 md:mt-0 flex gap-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
          >
            تسجيل دخول المدير
          </Link>

          <Link
            href="/teacher-login"
            className="px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
          >
            تسجيل دخول المعلم
          </Link>
        </div>
      </header>

      {/* Banner and Thank You Section with Fajr Logo opposite title */}
      <section className="w-full max-w-5xl mt-6 rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 w-full">
          <Image src="/school1.avif" alt="صورة المدرسة" width={600} height={400} className="w-full h-auto object-cover" />
        </div>
        <div className="md:w-1/2 w-full bg-white p-6 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">شكر وتقدير</h2>
            <Image src="/schoollogo.png" alt="شعار الفجر" width={48} height={48} className="object-contain" />
          </div>
          <p className="text-gray-700 text-lg md:text-xl">
            شكر خاص لمنظمة <span className="font-semibold text-blue-600">.....</span> ومؤسسة <span className="font-semibold text-blue-600">......</span> لدعمهما هذه المبادرة التعليمية لطلبة فلسطين في مصر.
            هذه المبادرة تهدف لدعم التعليم وتسهيل متابعة شؤون الطلبة وتوفير الموارد اللازمة لهم.
          </p>
        </div>
      </section>

      {/* Initiative Summary */}
      <section className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 mt-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">ملخص المبادرة</h2>
        <p className="text-gray-700 text-lg text-center">
          يتيح هذا النظام للمدير متابعة بيانات الطلبة والمعلمين بسهولة، تسجيل الغياب، متابعة النتائج، وإدارة الموارد المدرسية بطريقة سلسة وسهلة الاستخدام.
        </p>
      </section>

      {/* Gallery Section with Hover Zoom Effect */}
<section className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 mt-6">
  <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">المعرض</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {["/school1.jpg", "school2.jpg", "school3.jpg", "school4.jpg", "school5.jpg", "school6.jpg"].map((img, index) => (
      <div
        key={index}
        className="h-48 overflow-hidden rounded-xl bg-gray-100 shadow transform transition-transform duration-300 hover:scale-105"
      >
        <img
          src={`/gallery/${img}`}
          alt={`Gallery ${index + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
    ))}
  </div>
</section>

      <footer className="w-full max-w-5xl mt-12 text-center text-gray-500">
        &copy; 2025 جميع الحقوق محفوظة
      </footer>
    </main>
  );
}
