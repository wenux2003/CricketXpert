import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, BarChart3, FileText, Bell } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 text-gray-800 flex flex-col p-6 rounded-r-3xl shadow">
      {/* Logo / Title */}
      <h1 className="text-2xl font-bold mb-10 tracking-wide text-indigo-600">
        CricketXpert
      </h1>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <Link
          to="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            location.pathname === "/"
              ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm"
              : "hover:bg-gray-100"
          }`}
        >
          <Home size={20} /> Dashboard
        </Link>

        <Link
          to="/coaches"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            location.pathname === "/coaches"
              ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm"
              : "hover:bg-gray-100"
          }`}
        >
          <Users size={20} /> Coaches
        </Link>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
        >
          <Users size={20} /> Players
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
        >
          <Calendar size={20} /> Sessions
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
        >
          <BarChart3 size={20} /> Programs
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
        >
          <FileText size={20} /> Certificates
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
        >
          <Bell size={20} /> Notifications
        </a>
      </nav>

      {/* Bottom Premium Banner */}
      <div className="mt-auto mb-12 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-center">
        <span className="block mb-2 text-gray-700 font-medium">
          Use our Premium Features Now!
        </span>
        <button className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold hover:bg-indigo-700 transition">
          Upgrade
        </button>
      </div>
    </aside>
  );
}
