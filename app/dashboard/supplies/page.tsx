"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // <-- أضفنا Link

export default function SuppliesPage() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 0 });
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    const res = await fetch("/api/supplies");
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async () => {
    if (!newItem.name.trim()) return;
    setLoading(true);
    await fetch("/api/supplies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    setNewItem({ name: "", quantity: 0 });
    setLoading(false);
    fetchItems();
  };

  const decreaseQuantity = async (id: string) => {
    await fetch(`/api/supplies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "decrease" }),
    });
    fetchItems();
  };

  const increaseQuantity = async (id: string) => {
    await fetch(`/api/supplies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "increase" }),
    });
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    const confirmDelete = confirm("هل أنت متأكد من حذف الصنف بالكامل؟");
    if (!confirmDelete) return;
    await fetch(`/api/supplies/${id}`, { method: "DELETE" });
    fetchItems();
  };

  return (
   <div className="p-6 flex flex-col">
  {/* العنوان مع زر التقارير */}
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold text-blue-700">
      🛒 إدارة مخزون المستلزمات
    </h1>

    {/* زر الذهاب إلى صفحة التقارير */}
    <Link href="/dashboard/supplies/reports">
      <button className="bg-green-500 text-white px-4 py-2 rounded">
        📊 التقارير
      </button>
    </Link>
  </div>

  {/* نموذج إضافة صنف جديد */}
  <div className="bg-white p-4 shadow rounded mb-6 text-right">
    <h2 className="text-xl font-semibold mb-4">➕ إضافة صنف جديد</h2>
    <input
      type="text"
      placeholder="اسم الصنف"
      className="border p-2 rounded w-full mb-3 text-right"
      value={newItem.name}
      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
    />
    <input
      type="number"
      placeholder="الكمية"
      className="border p-2 rounded w-full mb-3 text-right"
      value={newItem.quantity}
      onChange={(e) =>
        setNewItem({ ...newItem, quantity: Number(e.target.value) })
      }
    />
    <button
      onClick={addItem}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      {loading ? "جارٍ الإضافة..." : "إضافة الصنف"}
    </button>
  </div>

  {/* جدول الأصناف */}
  <div className="bg-white p-4 shadow rounded">
    <h2 className="text-xl font-semibold mb-4 text-right">📦 المخزون الحالي</h2>

    <table className="w-full text-right border">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">اسم الصنف</th>
          <th className="p-2 border">الكمية</th>
          <th className="p-2 border">الحالة</th>
          <th className="p-2 border">إجراءات</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item: any) => (
          <tr key={item._id}>
            <td className="p-2 border">{item.name}</td>
            <td
              className={`p-2 border font-bold ${
                item.quantity === 0 ? "text-red-600" : ""
              }`}
            >
              {item.quantity}
            </td>
            <td className="p-2 border">
              {item.quantity === 0 ? (
                <span className="text-red-600 font-bold">❌ نافد</span>
              ) : item.quantity < 5 ? (
                <span className="text-yellow-600 font-bold">⚠️ كمية قليلة</span>
              ) : (
                <span className="text-green-600 font-bold">✔️ متوفر</span>
              )}
            </td>
            <td className="p-2 border flex gap-2 justify-end">
              <button
                onClick={() => increaseQuantity(item._id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                ➕
              </button>
              <button
                onClick={() => decreaseQuantity(item._id)}
                disabled={item.quantity === 0}
                className="bg-orange-500 text-white px-3 py-1 rounded disabled:bg-gray-400"
              >
                ➖
              </button>
              <button
                onClick={() => deleteItem(item._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                🗑 حذف
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {items.some((i: any) => i.quantity === 0) && (
      <div className="mt-4 text-red-600 font-bold text-right">
        ⚠️ يوجد أصناف نفدت من المخزون!
      </div>
    )}
  </div>
</div>

  );
}
