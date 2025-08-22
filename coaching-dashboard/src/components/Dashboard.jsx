import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", enrollments: 20 },
  { name: "Feb", enrollments: 35 },
  { name: "Mar", enrollments: 50 },
  { name: "Apr", enrollments: 40 },
  { name: "May", enrollments: 65 },
  { name: "Jun", enrollments: 80 },
];

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-100">
        <Topbar />

        {/* Stats */}
        <div className="p-6 grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold">Total Coaches</h3>
            <p className="text-2xl font-bold">12</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold">Active Players</h3>
            <p className="text-2xl font-bold">45</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold">Upcoming Sessions</h3>
            <p className="text-2xl font-bold">8</p>
          </div>
        </div>

        {/* Chart + Table */}
        <div className="p-6 grid grid-cols-2 gap-6">
          {/* Chart */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">Enrollment Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="enrollments" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">Recent Enrollments</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border-b">Player</th>
                  <th className="p-2 border-b">Program</th>
                  <th className="p-2 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-100">
                  <td className="p-2 border-b">John Smith</td>
                  <td className="p-2 border-b">Batting Basics</td>
                  <td className="p-2 border-b text-green-600 font-semibold">Completed</td>
                </tr>
                <tr className="hover:bg-gray-100">
                  <td className="p-2 border-b">Alice Brown</td>
                  <td className="p-2 border-b">Bowling Mastery</td>
                  <td className="p-2 border-b text-yellow-600 font-semibold">Ongoing</td>
                </tr>
                <tr className="hover:bg-gray-100">
                  <td className="p-2 border-b">Michael Lee</td>
                  <td className="p-2 border-b">Fitness Training</td>
                  <td className="p-2 border-b text-blue-600 font-semibold">Enrolled</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
