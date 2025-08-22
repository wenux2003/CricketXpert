import { Home, Users, Calendar, BarChart3, FileText } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-8">CoachingXpert</h1>
      <nav className="flex flex-col gap-4">
        <a href="#" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
          <Home size={20}/> Dashboard
        </a>
        <a href="#" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
          <Users size={20}/> Coaches
        </a>
        <a href="#" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
          <Calendar size={20}/> Sessions
        </a>
        <a href="#" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
          <BarChart3 size={20}/> Reports
        </a>
        <a href="#" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
          <FileText size={20}/> Certificates
        </a>
      </nav>
    </div>
  );
}
