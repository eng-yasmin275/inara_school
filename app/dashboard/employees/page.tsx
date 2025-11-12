'use client';

import { useState, useEffect } from "react";

type Employee = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  subjects: string[];
  classes: string[];
  username: string;
  password?: string;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    role: "معلم",
    subjects: [] as string[],
    classes: [] as string[],
    username: "",
    password: "",
  });

  const subjectsList = ["عربي", "إنجليزي", "رياضيات", "علوم"];
  const classesList = [
    "الصف الأول",
    "الصف الثاني",
    "الصف الثالث",
    "الصف الرابع",
    "الصف الخامس",
    "الصف السادس",
    "الصف السابع",
    "الصف الثامن",
    "الصف التاسع",
  ];
  const rolesList = ["موظف","معلم", "مشرف", "إداري"];

  // Fetch all employees
  const fetchEmployees = async () => {
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Checkbox handler for subjects/classes
  const handleCheckboxChange = (field: "subjects" | "classes", value: string) => {
    setNewEmployee((prev) => {
      const isSelected = prev[field].includes(value);
      const updated = isSelected
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value];
      return { ...prev, [field]: updated };
    });
  };

  // Open form for editing employee
  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setNewEmployee({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      subjects: employee.subjects || [],
      classes: employee.classes || [],
      username: employee.username,
      password: employee.password || "",
    });
    setShowForm(true);
  };

  // Delete employee
  const handleDelete = async (employee: Employee) => {
    if (!confirm(`هل أنت متأكد من حذف ${employee.name}؟`)) return;
    const res = await fetch(`/api/employees/${employee._id}`, { method: "DELETE" });
    if (res.ok) fetchEmployees();
  };

  // Add or update employee
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingEmployee
      ? `/api/employees/${editingEmployee._id}`
      : "/api/employees";
    const method = editingEmployee ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployee),
    });

    if (res.ok) {
      fetchEmployees();
      setShowForm(false);
      setEditingEmployee(null);
      setNewEmployee({
        name: "",
        email: "",
        phone: "",
        role: "معلم",
        subjects: [],
        classes: [],
        username: "",
        password: "",
      });
    } else {
      const errData = await res.json();
      alert(errData.error || "حدث خطأ أثناء الحفظ");
    }
  };

  return (
    <div className="p-6 text-right">
      <h1 className="text-2xl font-bold mb-4">إدارة الموظفين</h1>

      <button
        onClick={() => setShowForm(true)}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        إضافة موظف جديد
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6 mb-6 text-right">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="اسم الموظف"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="رقم الهاتف"
              value={newEmployee.phone}
              onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="اسم المستخدم"
              value={newEmployee.username}
              onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
              className="border p-2 rounded"
              
            />
           {/* Password (optional) */}
<input
  type="text" // show password as text
  placeholder="كلمة المرور (اختياري)"
  value={newEmployee.password || ""} // show existing password if any
  onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
  className="border p-2 rounded"
/>
          </div>

          {/* Role Dropdown */}
          <div className="mt-4">
            <label className="font-semibold block mb-2">الدور:</label>
            <select
              value={newEmployee.role}
              onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
              className="border p-2 rounded w-full"
            >
              {rolesList.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Subjects */}
          <div className="mt-4">
            <label className="font-semibold block mb-2">المواد الدراسية:</label>
            <div className="flex flex-wrap gap-4">
              {subjectsList.map((subj) => (
                <label key={subj} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newEmployee.subjects.includes(subj)}
                    onChange={() => handleCheckboxChange("subjects", subj)}
                  />
                  {subj}
                </label>
              ))}
            </div>
          </div>

          {/* Classes */}
          <div className="mt-4">
            <label className="font-semibold block mb-2">الصفوف التي يدرسها:</label>
            <div className="flex flex-wrap gap-4">
              {classesList.map((cls) => (
                <label key={cls} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newEmployee.classes.includes(cls)}
                    onChange={() => handleCheckboxChange("classes", cls)}
                  />
                  {cls}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {editingEmployee ? "تحديث الموظف" : "إضافة الموظف"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingEmployee(null);
                setNewEmployee({
                  name: "",
                  email: "",
                  phone: "",
                  role: "معلم",
                  subjects: [],
                  classes: [],
                  username: "",
                  password: "",
                });
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}

      {/* Employee Table */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">الاسم</th>
            <th className="border p-2">الدور</th>
            <th className="border p-2">المواد</th>
            <th className="border p-2">الصفوف</th>
            <th className="border p-2">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td className="border p-2">{emp.name}</td>
              <td className="border p-2">{emp.role}</td>
              <td className="border p-2">{emp.subjects.join(", ") || "—"}</td>
              <td className="border p-2">{emp.classes.join(", ") || "—"}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(emp)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(emp)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
