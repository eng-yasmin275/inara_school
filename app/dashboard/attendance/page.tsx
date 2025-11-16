'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

type Person = {
  _id: string;
  name: string;
  className?: string;
};

export default function AttendanceDashboard() {
  const [category, setCategory] = useState<"students" | "employees" | "">("");
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [people, setPeople] = useState<Person[]>([]);
  const [monthDays, setMonthDays] = useState<number[]>([]);
  const [attendance, setAttendance] = useState<{ [personId: string]: boolean[] }>({});
  const [holidays, setHolidays] = useState<number[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Fetch classes when students category is selected
  useEffect(() => {
    if (category === "students") {
      fetch("/api/students")
        .then(res => res.json())
        .then(data => {
          const uniqueClasses = Array.from(new Set(data.map((s: any) => s.className).filter(Boolean))) as string[];
          setClasses(uniqueClasses);
        });
    } else {
      setClasses([]);
      setSelectedClass("");
    }
  }, [category]);

  // Fetch people and saved attendance
  useEffect(() => {
    if (!category) return;
    if (category === "students" && !selectedClass) {
      setPeople([]);
      setAttendance({});
      setHolidays([]);
      return;
    }

    const fetchData = async () => {
      let url = category === "employees" ? "/api/employees" : "/api/students";
      const res = await fetch(url);
      let data: Person[] = await res.json();

      if (category === "students" && selectedClass) {
        data = data.filter(s => s.className === selectedClass);
      }

      setPeople(data);

      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      setMonthDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));

      // Fetch saved attendance
      const attRes = await fetch(`/api/attendance?category=${category}&className=${selectedClass}&month=${selectedMonth}&year=${selectedYear}`);
      const attData = await attRes.json();

      const initialAttendance: { [id: string]: boolean[] } = {};
      data.forEach(person => {
        initialAttendance[person._id] = Array(daysInMonth).fill(false);
        if (attData.attendance && attData.attendance[person._id]) {
          initialAttendance[person._id] = attData.attendance[person._id];
        }
      });

      setAttendance(initialAttendance);
      setHolidays(attData?.holidays || []);
    };

    fetchData();
  }, [category, selectedClass, selectedMonth, selectedYear]);

  // Toggle attendance and save immediately
  const toggleAttendance = async (personId: string, dayIndex: number) => {
    const updated = {
      ...attendance,
      [personId]: attendance[personId].map((v, i) => i === dayIndex ? !v : v),
    };
    setAttendance(updated);

    const person = people.find(p => p._id === personId);
    if (!person) return;

    // Save to DB
    await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personId,
        category,
        className: selectedClass,
        month: selectedMonth,
        year: selectedYear,
        attendance: updated[personId],
        holidays,
      }),
    });
  };

  const isHoliday = (day: number) => {
    const date = new Date(selectedYear, selectedMonth - 1, day);
    const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat
    return dayOfWeek === 5 || dayOfWeek === 6 || holidays.includes(day);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-blue-700">📋 حضور وغياب</h1>
        <Link href="/dashboard">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">← العودة</button>
        </Link>
      </div>

      {/* Month/Year */}
      <div className="flex gap-4 items-center mb-4 text-lg font-semibold">
        <span>الشهر:</span>
        <select className="border p-1 rounded" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <span>السنة:</span>
        <input type="number" className="border p-1 rounded w-20" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} />
      </div>

      {/* Extra Holidays */}
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <span>إضافة يوم إجازة إضافي:</span>
          <select className="border p-1 rounded" onChange={(e) => {
            const day = Number(e.target.value);
            if (day && !holidays.includes(day)) setHolidays([...holidays, day]);
          }} value="">
            <option value="">اختر اليوم</option>
            {monthDays.filter(d => !isHoliday(d)).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        {holidays.length > 0 && (
          <div className="flex gap-2 items-center flex-wrap">
            <span>الإجازات الإضافية المضافة:</span>
            {holidays.map(d => (
              <div key={d} className="bg-red-200 text-red-800 px-2 py-1 rounded flex items-center gap-1">
                {d}
                <button onClick={() => setHolidays(holidays.filter(h => h !== d))} className="font-bold">×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category / Class */}
      <div className="flex gap-4 mb-4">
        <select className="border p-2 rounded" value={category} onChange={e => setCategory(e.target.value as any)}>
          <option value="">اختر الفئة</option>
          <option value="students">طلاب</option>
          <option value="employees">موظفين</option>
        </select>

        {category === "students" && (
          <select className="border p-2 rounded" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
            <option value="">اختر الصف</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      {/* Attendance Table */}
      {people.length > 0 && (
        <div className="overflow-x-auto">
          <table className="border-collapse border w-full text-center">
            <thead>
              <tr>
                <th className="border p-2 sticky top-0 bg-gray-200">الاسم</th>
                {monthDays.map(day => (
                  <th key={day} className={`border p-2 sticky top-0 ${isHoliday(day) ? "bg-red-200" : "bg-gray-100"}`}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {people.map(person => (
                <tr key={person._id}>
                  <td className="border p-2">{person.name}</td>
                  {monthDays.map((day, idx) => (
                    <td key={idx} className={`border p-1 ${isHoliday(day) ? "bg-red-100" : ""}`}>
                      {!isHoliday(day) && attendance[person._id] && (
                        <input type="checkbox" className="w-5 h-5" checked={attendance[person._id][idx]} onChange={() => toggleAttendance(person._id, idx)} />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
