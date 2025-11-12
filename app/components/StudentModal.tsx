'use client';

import React from "react";

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

interface StudentModalProps {
  student: Student;
  onClose: () => void;
  onSave: (updatedStudent: Student) => void | Promise<void>;
}

export default function StudentModal({ student, onClose, onSave }: StudentModalProps) {
  const [editedStudent, setEditedStudent] = React.useState(student);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedStudent({ ...editedStudent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(editedStudent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-right">
        <h2 className="text-xl font-bold mb-4">تعديل بيانات الطالب</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            value={editedStudent.name}
            onChange={handleChange}
            placeholder="اسم الطالب"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="className"
            value={editedStudent.className}
            onChange={handleChange}
            placeholder="الصف"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="email"
            value={editedStudent.email}
            onChange={handleChange}
            placeholder="البريد الإلكتروني"
            className="w-full border p-2 rounded"
          />
          <input
            name="phone"
            value={editedStudent.phone}
            onChange={handleChange}
            placeholder="رقم الهاتف"
            className="w-full border p-2 rounded"
          />
          <input
            type="date"
            name="birthdate"
            value={editedStudent.birthdate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <textarea
            name="notes"
            value={editedStudent.notes}
            onChange={handleChange}
            placeholder="ملاحظات"
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
