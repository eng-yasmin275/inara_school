"use client";

export default function LogoutButton() {
  const handleLogout = () => {
    // Clear cookies (client-side)
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Optional: clear localStorage if you store admin data
    localStorage.removeItem("adminData");

    window.location.href = "/?loggedOut=1";
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
    >
      تسجيل الخروج
    </button>
  );
}
