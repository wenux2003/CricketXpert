import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, BarChart3, FileText, Bell } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="h-screen w-64 bg-[#171820] text-white flex flex-col p-6 rounded-r-3xl relative">
      <h1 className="text-2xl font-bold mb-10 tracking-wide">CricketXpert</h1>
      <nav className="flex flex-col gap-2">
        <Link 
          to="/" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            location.pathname === '/' 
              ? 'bg-[#1d2435] font-medium shadow-lg' 
              : 'hover:bg-[#232b3e]'
          }`}
        >
          <Home size={20}/> Dashboard
        </Link>
        <Link 
          to="/coaches" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            location.pathname === '/coaches' 
              ? 'bg-[#1d2435] font-medium shadow-lg' 
              : 'hover:bg-[#232b3e]'
          }`}
        >
          <Users size={20}/> Coaches
        </Link>

        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#232b3e] transition">
          <Users size={20}/> Players
        </a>

        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#232b3e] transition">
          <Calendar size={20}/> Sessions
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#232b3e] transition">
          <BarChart3 size={20}/> Programs
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#232b3e] transition">
          <FileText size={20}/> Certificates
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#232b3e] transition">
          < Bell size={20}/>Notifications
        </a>
        
      </nav>
      <div className="mt-auto mb-12 p-4 bg-[#252943] rounded-xl text-center">
        <span className="block mb-2">Use our Premium Features Now!</span>
        <button className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold mt-2">Upgrade</button>
      </div>
    </aside>
  );
}
