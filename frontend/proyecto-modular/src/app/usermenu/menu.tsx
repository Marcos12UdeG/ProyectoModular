"use client";
import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const handleLogout = () => {
  console.log("Logout clicked");

  if (user?.id_session) {
    fetch(`http://localhost:8000/logout/${user.id_session}`, { method: "POST" })
      .then(res => res.json())
      .then(data => console.log("Logout backend:", data))
      .catch(err => console.warn("No se pudo registrar logout, seguimos igual:", err));
  }

  setUser(null);
  setOpen(false);
  router.push("/");
};


  return (
    <div className="fixed top-1 right-4 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-15 h-15 bg-[#8B3E2F] text-white rounded-full shadow-lg hover:bg-[#A44C3B] transition overflow-visible flex items-center justify-center"
      >
        <img
          src="/images/perfil.jpg"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-13 w-13 rounded-full object-cover"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg p-4 flex flex-col gap-3 origin-top-right">
          <div className="flex flex-col items-center gap-1 border-b pb-2">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <button className="w-full bg-[#FDE2D3] text-[#8B3E2F] py-2 rounded-lg font-medium hover:bg-[#F8CBA6] transition">
            Gestionar
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
