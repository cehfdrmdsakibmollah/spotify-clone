import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaSearch, FaBook, FaHeart } from "react-icons/fa";

export default function Sidebar() {
  const nav = [
    { to: "/", label: "Home", icon: <FaHome /> },
    { to: "/search", label: "Search", icon: <FaSearch /> },
    { to: "/library", label: "Your Library", icon: <FaBook /> },
    { to: "/liked", label: "Liked", icon: <FaHeart /> },
  ];

  return (
    <aside className="w-64 bg-[#040404] border-r border-black/40 h-screen p-6 flex flex-col">
      <div className="mb-6">
        <div className="text-2xl font-black">🎵 MyMusic</div>
      </div>

      <nav className="flex-1 space-y-2">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-[#121212] text-white' : 'text-[#9CA3AF] hover:text-white hover:bg-[#0d0d0d]'}`
            }
          >
            <span className="text-lg">{n.icon}</span>
            <span className="font-medium">{n.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 text-sm text-gray-500">© 2025 MyMusic</div>
    </aside>
  );
}
