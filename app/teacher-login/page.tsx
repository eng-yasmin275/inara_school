'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TeacherLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch('/api/auth/teacher-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    console.log('API Response:', data);

    if (!res.ok) {
      setError(data.message || 'حدث خطأ');
      return;
    }

    if (!data.token) {
      setError('لم يتم إنشاء التوكن!');
      return;
    }

    // Save token and teacher data in localStorage
    localStorage.setItem('teacherToken', data.token);
    localStorage.setItem('teacherClasses', JSON.stringify(data.teacherClasses || []));
    localStorage.setItem('teacherSubjects', JSON.stringify(data.teacherSubjects || []));

    router.push('/teacher-dashboard');
  } catch (err) {
    console.error(err);
    setError('حدث خطأ أثناء تسجيل الدخول');
  }
};


  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">تسجيل دخول المعلم</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
}
