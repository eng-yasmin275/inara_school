'use client';

import { useEffect, useState } from 'react';

type Result = {
  subject: string;
  midterm1?: number;
  finalTerm?: number;
  exercises?: number;
  classActivities?: number;
  homework?: number;
};

type GradeField = 'midterm1' | 'finalTerm' | 'exercises' | 'classActivities' | 'homework';

type Student = {
  _id: string;
  nationalId: string;
  name: string;
  className: string;
  results: Result[];
};

export default function TeacherDashboard() {
  const [teacherClasses, setTeacherClasses] = useState<string[]>([]);
  const [teacherSubjects, setTeacherSubjects] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load token and saved classes/subjects after mount
  useEffect(() => {
    setMounted(true);

    // Prefer cookie first
    const cookieToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('teacherToken='))
      ?.split('=')[1];

    const savedToken = cookieToken || localStorage.getItem('teacherToken');
    const savedClasses = localStorage.getItem('teacherClasses');
    const savedSubjects = localStorage.getItem('teacherSubjects');

    if (savedToken) setToken(savedToken);
    if (savedClasses) setTeacherClasses(JSON.parse(savedClasses));
    if (savedSubjects) setTeacherSubjects(JSON.parse(savedSubjects));
  }, []);

  // Fetch classes & subjects assigned to teacher
  useEffect(() => {
    if (!token) return;

    fetch(`/api/teacher/students`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const classes = data.teacherClasses || [];
        const subjects = data.teacherSubjects || [];
        setTeacherClasses(classes);
        setTeacherSubjects(subjects);

        localStorage.setItem('teacherClasses', JSON.stringify(classes));
        localStorage.setItem('teacherSubjects', JSON.stringify(subjects));
      })
      .catch(console.error);
  }, [token]);

  const fetchStudents = async () => {
    if (!selectedClass || !selectedSubject || !token) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/teacher/students?class=${selectedClass}&subject=${selectedSubject}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const fetchedStudents = data.students || [];

      const gradesRes = await fetch(`/api/teacher/get-scores?className=${selectedClass}&subject=${selectedSubject}`);
      const gradesData = await gradesRes.json();
      const savedGrades = gradesData.grades || [];

      const merged = fetchedStudents.map((student: any) => {
        const g = savedGrades.find((grade: any) => grade.nationalId === student.nationalId);
        if (g) {
          return {
            ...student,
            results: [
              {
                subject: selectedSubject,
                midterm1: g.midterm1,
                finalTerm: g.finalTerm,
                exercises: g.exercises,
                classActivities: g.classActivities,
                homework: g.homework,
              },
            ],
          };
        }
        return student;
      });

      setStudents(merged);
    } catch (err) {
      console.error("Error fetching students or grades:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (studentId: string, field: GradeField, value: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s._id !== studentId) return s;

        let result = s.results.find((r) => r.subject === selectedSubject);
        if (!result) {
          result = { subject: selectedSubject };
          s.results.push(result);
        }
        result[field] = value;

        return { ...s };
      })
    );
  };

  const saveAllGrades = async () => {
    if (!token || !selectedSubject) return;
    setSaving(true);
    try {
      const payload = students.map((s) => ({
        nationalId: s.nationalId,
        className: s.className,
        result: s.results.find((r) => r.subject === selectedSubject) || { subject: selectedSubject },
      }));

      const res = await fetch('/api/teacher/save-all-scores', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject: selectedSubject, students: payload }),
      });

      if (!res.ok) throw new Error('Failed to save');
      alert('✅ تم حفظ جميع الدرجات بنجاح');
    } catch (err) {
      console.error(err);
      alert('❌ حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    // Remove localStorage and redirect
    localStorage.removeItem('teacherToken');
    localStorage.removeItem('teacherClasses');
    localStorage.removeItem('teacherSubjects');

    // Remove cookie
    document.cookie = 'teacherToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

  window.location.href = '/?loggedOut=1';
  };

  if (!mounted) return null;
  if (!token) return <p className="p-6">يجب تسجيل الدخول للوصول للوحة المعلم</p>;

  return (
    <div className="p-6 text-right">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">لوحة المعلم – تسجيل الدرجات</h1>
        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">
          تسجيل الخروج
        </button>
      </div>

      {/* Class & Subject Selection */}
      <div className="flex gap-4 mb-6">
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="border p-2 rounded">
          <option value="">اختر الصف</option>
          {teacherClasses.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="border p-2 rounded">
          <option value="">اختر المادة</option>
          {teacherSubjects.map((subj) => (
            <option key={subj} value={subj}>
              {subj}
            </option>
          ))}
        </select>

        <button onClick={fetchStudents} className="bg-blue-600 text-white px-4 py-2 rounded">
          عرض الطلاب
        </button>
      </div>

      {loading && <p>جاري التحميل...</p>}

      {students.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">الاسم</th>
                <th className="border p-2">الصف</th>
                <th className="border p-2">اختبار نصف الفصل</th>
                <th className="border p-2">الامتحان النهائي</th>
                <th className="border p-2">تمارين</th>
                <th className="border p-2">نشاطات صفية</th>
                <th className="border p-2">واجب منزلي</th>
                <th className="border p-2">المجموع</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const result = student.results.find((r) => r.subject === selectedSubject) || { subject: selectedSubject };
                const total = (result.midterm1 || 0) + (result.finalTerm || 0) + (result.exercises || 0) + (result.classActivities || 0) + (result.homework || 0);

                return (
                  <tr key={student._id}>
                    <td className="border p-2">{student.name}</td>
                    <td className="border p-2">{student.className}</td>
                    {( ['midterm1','finalTerm','exercises','classActivities','homework'] as GradeField[] ).map((f) => (
                      <td className="border p-2" key={f}>
                        <input type="number" value={result[f] ?? ''} onChange={(e) => handleGradeChange(student._id, f, Number(e.target.value))} className="border p-1 w-16" />
                      </td>
                    ))}
                    <td className="border p-2">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button onClick={saveAllGrades} disabled={saving} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
            {saving ? 'جاري الحفظ...' : 'حفظ جميع الدرجات'}
          </button>
        </div>
      )}

      {students.length === 0 && !loading && <p>لا يوجد طلاب</p>}
    </div>
  );
}
