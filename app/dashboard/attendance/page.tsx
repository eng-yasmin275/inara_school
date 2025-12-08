'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

type Person = {
  _id: string;
  name: string;
  className?: string;
};

type AttendanceData = { [personId: string]: boolean[] };

export default function AttendanceDashboard() {
  const [category, setCategory] = useState<"students" | "employees" | "">("");
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [people, setPeople] = useState<Person[]>([]);
  const [monthDays, setMonthDays] = useState<number[]>([]);
  const [attendance, setAttendance] = useState<AttendanceData>({});
  const [holidays, setHolidays] = useState<number[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState("");
  const [popupDay, setPopupDay] = useState<number | null>(null);

  const currentSchoolYear = `${selectedYear}/${selectedYear + 1}`;
  const today = new Date();
  const currentDay = (selectedYear === today.getFullYear() && selectedMonth === today.getMonth() + 1) ? today.getDate() : Infinity;

  // Fetch classes when category changes
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

  // Fetch people and attendance
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
      let res = await fetch(url);
      let data: Person[] = await res.json();

      if (category === "students" && selectedClass) {
        data = data.filter(s => s.className === selectedClass);
      }

      // Sort names alphabetically
      data.sort((a, b) => a.name.localeCompare(b.name));
      setPeople(data);

      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      setMonthDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));

      const attRes = await fetch(`/api/attendance?category=${category}&className=${selectedClass}&month=${selectedMonth}&year=${selectedYear}&schoolYear=${currentSchoolYear}`);
      const attData = await attRes.json();

      const initialAttendance: AttendanceData = {};
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

  const toggleAttendance = (personId: string, dayIndex: number) => {
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    // Block future months/years and future days
    if (selectedYear > currentYear) return;
    if (selectedYear === currentYear && selectedMonth > currentMonth) return;
    if (selectedYear === currentYear && selectedMonth === currentMonth && dayIndex + 1 > currentDay) return;

    const updated = {
      ...attendance,
      [personId]: attendance[personId].map((v, i) => i === dayIndex ? !v : v),
    };
    setAttendance(updated);
  };

  const handleSaveAll = async () => {
    await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        schoolYear: currentSchoolYear,
        month: selectedMonth,
        year: selectedYear,
        attendanceData: attendance,
        holidays
      }),
    });
    alert("تم حفظ الحضور والإجازات لجميع الأشخاص");
  };

  const isHoliday = (day: number) => {
    const date = new Date(selectedYear, selectedMonth - 1, day);
    const dayOfWeek = date.getDay(); // 0=Sun,5=Fri,6=Sat
    return holidays.includes(day) || dayOfWeek === 5 || dayOfWeek === 6;
  };

  const handleDayClick = (day: number) => {
    const date = new Date(selectedYear, selectedMonth - 1, day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6) return; // ignore weekends
    setPopupDay(day);
  };

  const addHoliday = (day: number) => {
    if (!holidays.includes(day)) setHolidays([...holidays, day]);
    setPopupDay(null);
  };

  const removeHoliday = (day: number) => {
    setHolidays(holidays.filter(d => d !== day));
    setPopupDay(null);
  };

  // Filtered people by search term
  const filteredPeople = people.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h1 className="text-3xl font-bold text-blue-700">📋 حضور وغياب</h1>
        <Link href="/dashboard">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">← العودة</button>
        </Link>
      </div>

      {/* Month/Year */}
      <div className="flex gap-4 items-center mb-4 text-lg font-semibold flex-wrap">
        <span>الشهر:</span>
        <select className="border p-1 rounded" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <span>السنة:</span>
        <input type="number" className="border p-1 rounded w-20" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} />
      </div>

      {/* Category / Class */}
      <div className="flex gap-4 mb-4 flex-wrap">
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

        {/* Search input */}
        <input
          type="text"
          className="border p-1 rounded w-full md:w-1/3"
          placeholder="ابحث باسم الطالب أو الموظف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Attendance Table */}
      {filteredPeople.length > 0 && (
        <div className="overflow-x-auto relative">
          <table className="border-collapse border w-full text-center">
            <thead>
              <tr>
                <th className="border p-2 sticky top-0 bg-gray-200">الاسم</th>
                {monthDays.map(day => (
                  <th
                    key={day}
                    className={`border p-2 sticky top-0 ${isHoliday(day) ? "bg-red-400 text-white font-bold" : "bg-gray-100"}`}
                    onClick={() => handleDayClick(day)}
                  >
                    {isHoliday(day) ? "H" : day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPeople.map(person => (
                <tr key={person._id}>
                  <td className="border p-2">{person.name}</td>
                  {monthDays.map((day, idx) => (
                    <td
                      key={idx}
                      className={`border p-1 ${isHoliday(day) ? "bg-gray-300 text-gray-600 font-bold" : ""} ${day > currentDay ? "bg-gray-200" : ""}`}
                    >
                      {!isHoliday(day) && idx < currentDay && attendance[person._id] && (
                        <input type="checkbox" className="w-5 h-5" checked={attendance[person._id][idx]} onChange={() => toggleAttendance(person._id, idx)} />
                      )}
                      {isHoliday(day) && <span>{day}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Holiday popup */}
          {popupDay && (
            <div className="absolute z-50 bg-white border p-2 rounded shadow-md" style={{ top: 0, left: 0 }}>
              {!isHoliday(popupDay) ? (
                <button className="p-1 text-green-600 font-bold" onClick={() => addHoliday(popupDay)}>✔ Make Holiday</button>
              ) : (
                <button className="p-1 text-red-600 font-bold" onClick={() => removeHoliday(popupDay)}>✖ Remove Holiday</button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Save All Button */}
      <div className="mt-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSaveAll}>💾 Save All</button>
      </div>
    </div>
  );
}
