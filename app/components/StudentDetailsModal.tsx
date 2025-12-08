// StudentDetailsModal.tsx
'use client';

import { useState, useEffect } from 'react';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import "@/app/fonts/Amiri-Bold-normal"; // just import the JS file; it will register the font with jsPDF


type Result = {
  subject: string;
  total: number;
};

type Student = {
  _id: string;
  nationalId: string;
  name: string;
  className: string;
  birthdate: string;
  email: string;
  phone: string;
  notes: string;
  absence: number;
};

interface Props {
  student: Student;
  onClose: () => void;
}

export default function StudentDetailsModal({ student, onClose }: Props) {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await fetch(`/api/grades?nationalId=${student.nationalId}`);
        const data = await res.json();
        setResults(data.grades || []);
      } catch (err) {
        console.error('Error fetching grades:', err);
      }
    };
    fetchGrades();
  }, [student.nationalId]);

const exportPDF = () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  // Set Arabic font if you added one
  doc.setFont('Amiri-Bold', 'normal');
  doc.setFontSize(18);
  doc.text('تقرير درجات الطالب', 210, 40, { align: 'center' });

  const startY = 70;
  doc.setFontSize(12);
  doc.text(`الاسم: ${student.name}`, 40, startY);
  doc.text(`الرقم القومي: ${student.nationalId}`, 40, startY + 20);
  doc.text(`الصف: ${student.className}`, 40, startY + 40);

  const tableData = results.map((r) => [r.subject, r.total.toString()]);

  // ✅ Use autoTable from the imported autoTable function
  autoTable(doc, {
    head: [['المادة', 'المجموع']],
    body: tableData,
    startY: startY + 100,
    styles: { halign: 'center', font: 'Amiri-Bold', fontSize: 12 },
    headStyles: { fillColor: [33, 150, 243] },
  });

  doc.save(`${student.name}_grades.pdf`);
};




  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mt-20 w-full max-w-3xl relative">
        <h2 className="text-2xl font-bold mb-4 text-center">تفاصيل الطالب</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <p><strong>الاسم:</strong> {student.name}</p>
          <p><strong>الرقم القومي:</strong> {student.nationalId}</p>
          <p><strong>الصف:</strong> {student.className}</p>
          <p><strong>تاريخ الميلاد:</strong> {student.birthdate}</p>
          <p><strong>البريد الإلكتروني:</strong> {student.email}</p>
          <p><strong>رقم الهاتف:</strong> {student.phone}</p>
          <p className="col-span-2"><strong>ملاحظات:</strong> {student.notes || '-'}</p>
        </div>

        <h3 className="text-xl font-semibold mb-2">الدرجات</h3>
        <table className="w-full border mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">المادة</th>
              <th className="border p-2">المجموع</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? results.map((r) => (
              <tr key={r.subject}>
                <td className="border p-2">{r.subject}</td>
                <td className="border p-2">{r.total}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={2} className="text-center p-2">لا توجد درجات</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={exportPDF} className="bg-green-600 text-white px-4 py-2 rounded">
            تصدير PDF
          </button>
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}