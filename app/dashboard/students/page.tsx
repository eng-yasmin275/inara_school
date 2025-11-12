'use client';

import { useState, useEffect } from "react";
import StudentModal from "@/app/components/StudentModal";

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
  results: { subject: string; score: number }[];
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newStudent, setNewStudent] = useState<Omit<Student, "_id">>({
    nationalId: "",
    name: "",
    className: "",
    birthdate: "",
    email: "",
    phone: "",
    notes: "",
    absence: 0,
    results: [],
  });
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Fetch students
  const fetchStudents = async () => {
    const res = await fetch("/api/students");
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add or update student
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingStudent ? "PUT" : "POST";
    const url = editingStudent
      ? `/api/students/${editingStudent._id}`
      : "/api/students";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent),
    });

    if (res.ok) {
      fetchStudents();
      setShowForm(false);
      setEditingStudent(null);
      setNewStudent({
        nationalId: "",
        name: "",
        className: "",
        birthdate: "",
        email: "",
        phone: "",
        notes: "",
        absence: 0,
        results: [],
      });
    } else {
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setNewStudent({
      nationalId: student.nationalId,
      name: student.name,
      className: student.className,
      birthdate: student.birthdate,
      email: student.email,
      phone: student.phone,
      notes: student.notes,
      absence: student.absence,
      results: student.results,
    });
    setShowForm(true);
  };

  const handleDelete = async (student: Student) => {
    if (!confirm(`هل أنت متأكد من حذف ${student.name}؟`)) return;

    const res = await fetch(`/api/students/${student._id}`, { method: "DELETE" });
    if (res.ok) {
      fetchStudents();
    } else {
      alert("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="p-6 text-right">
      <h1 className="text-2xl font-bold mb-4">إدارة الطلاب</h1>

      <button
        onClick={() => setShowForm(true)}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        إضافة طالب جديد
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded p-6 mb-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="اسم الطالب"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="الرقم القومي"
              value={newStudent.nationalId}
              onChange={(e) => setNewStudent({ ...newStudent, nationalId: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={newStudent.email}
              onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="رقم الهاتف"
              value={newStudent.phone}
              onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="date"
              placeholder="تاريخ الميلاد"
              value={newStudent.birthdate}
              onChange={(e) => setNewStudent({ ...newStudent, birthdate: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="الصف"
              value={newStudent.className}
              onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <textarea
              placeholder="ملاحظات"
              value={newStudent.notes}
              onChange={(e) => setNewStudent({ ...newStudent, notes: e.target.value })}
              className="border p-2 rounded col-span-2"
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {editingStudent ? "تحديث الطالب" : "إضافة الطالب"}
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setShowForm(false)}
            >
              إلغاء
            </button>
          </div>
        </form>
      )}

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">الاسم</th>
            <th className="border p-2">الرقم القومي</th>
            <th className="border p-2">الصف</th>
            <th className="border p-2">البريد الإلكتروني</th>
            <th className="border p-2">رقم الهاتف</th>
            <th className="border p-2">تاريخ الميلاد</th>
            <th className="border p-2">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {students.map((stu) => (
            <tr key={stu._id}>
              <td className="border p-2">{stu.name}</td>
              <td className="border p-2">{stu.nationalId}</td>
              <td className="border p-2">{stu.className}</td>
              <td className="border p-2">{stu.email}</td>
              <td className="border p-2">{stu.phone}</td>
              <td className="border p-2">{stu.birthdate}</td>
              <td className="border p-2 flex gap-2 justify-center">
                <button
                  onClick={() => setSelectedStudent(stu)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(stu)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onSave={async (updated) => {
            const res = await fetch(`/api/students/${updated._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updated),
            });
            if (res.ok) {
              setStudents(
                students.map((s) => (s._id === updated._id ? updated : s))
              );
              setSelectedStudent(null);
            } else {
              alert("حدث خطأ أثناء الحفظ");
            }
          }}
        />
      )}
    </div>
  );
}
