import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { FiPackage, FiBox, FiAlertTriangle, FiCheckCircle, FiUsers } from "react-icons/fi";
import { ResponsiveContainer, Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";

const chartData = [
  { name: "Mon", daily: 12000, hourly: 1000 },
  { name: "Tue", daily: 15000, hourly: 1300 },
  { name: "Wed", daily: 17000, hourly: 1400 },
  { name: "Thu", daily: 14000, hourly: 1100 },
  { name: "Fri", daily: 20000, hourly: 1700 },
  { name: "Sat", daily: 22000, hourly: 1900 },
  { name: "Sun", daily: 18000, hourly: 1200 },
];

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#24253b]">
      <Sidebar />
      <main className="flex-1 flex flex-col px-10 py-6">
        <Topbar />
        {/* ACTIVITY CARDS */}
        <section className="grid grid-cols-4 gap-6 mb-8">
          <ActivityCard icon={<FiCheckCircle size={26} className="text-indigo-400" />}
                        label="Completed"
                        value="150 Players" />
          <ActivityCard icon={<FiUsers size={26} className="text-purple-400" />}
                        label="Users"
                        value="72 New Items" />
          <ActivityCard icon={<FiAlertTriangle size={26} className="text-yellow-400" />}
                        label="Reported"
                        value="72 Support Cases" />
          <ActivityCard icon={<FiBox size={26} className="text-green-400" />}
                        label="Arrived"
                        value="34 Upgraded Boxes" />
        </section>

        {/* MAIN DASH */}
        <section className="flex gap-6 mb-8">
          {/* REVENUE CARD & CHART */}
          <div className="flex-1 bg-[#1d2032] rounded-3xl p-8 shadow flex flex-col gap-8">
            <div>
              <h3 className="font-semibold text-gray-400 text-lg mb-2">Daily Revenue Overview</h3>
              <p className="text-3xl text-white font-bold">$ 8,27,000
                <span className="ml-6 text-xl text-gray-400 font-normal">$ 37,000 <span className="text-xs">Hourly</span></span>
              </p>
            </div>
            <div className="mt-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <Tooltip />
                  <Bar dataKey="daily" fill="#5466f9" radius={[7, 7, 0, 0]} />
                  <Bar dataKey="hourly" fill="#f7b731" radius={[7, 7, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SUPPORT CARD */}
          <div className="bg-[#21243a] text-white p-8 rounded-3xl w-80 flex flex-col justify-between shadow">
            <h3 className="text-lg font-bold mb-3">Support Center</h3>
            <p className="text-sm text-gray-300 mb-8">
              In acuda lorem. Present tempor dictum felis in finibus.
              Sed ullamcorper lorem eu tincidunt sodales. Duis vel gravida mauris.
            </p>
            <button className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold text-white">
              Contact Us
            </button>
          </div>
        </section>

        {/* MY APPOINTMENTS TABLE */}
        <section className="bg-[#1d2032] rounded-3xl p-8 shadow mb-8">
          <h3 className="text-xl text-white font-semibold mb-6">My Appointments</h3>
          <table className="w-full text-gray-300">
            <thead>
              <tr className="text-sm font-medium text-gray-400">
                <th className="p-3">Name</th>
                <th className="p-3">Specialist</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[#23263c]">
                <td className="p-3">Charles Bradley</td>
                <td className="p-3">Dance</td>
                <td className="p-3">27-Feb-2023</td>
                <td className="p-3">11:08 AM</td>
                <td className="p-3 text-green-400 font-bold flex items-center gap-2">✔︎</td>
              </tr>
              <tr>
                <td className="p-3">Jane Foreman</td>
                <td className="p-3">Therapist</td>
                <td className="p-3">15-Jul-2023</td>
                <td className="p-3">8:00 PM</td>
                <td className="p-3 text-yellow-400 font-bold">Pending</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* MY TEAM */}
        <div className="fixed right-8 bottom-8 bg-[#111221] w-72 rounded-2xl shadow-lg p-6">
          <h4 className="text-white font-bold mb-4">My Team</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <img src="https://randomuser.me/api/portraits/women/30.jpg" alt="..." className="w-10 h-10 rounded-full" />
              <span>
                <span className="block text-white">Elizabeth McCoy</span>
                <span className="block text-sm text-gray-400">Admin</span>
              </span>
            </li>
            <li className="flex items-center gap-3">
              <img src="https://randomuser.me/api/portraits/men/24.jpg" alt="..." className="w-10 h-10 rounded-full" />
              <span>
                <span className="block text-white">Dan Reyes</span>
                <span className="block text-sm text-gray-400">Admin</span>
              </span>
            </li>
            {/* Add more people as needed */}
          </ul>
        </div>
      </main>
    </div>
  );
}

function ActivityCard({ icon, label, value }) {
  return (
    <div className="bg-[#21243a] rounded-2xl p-6 flex flex-col gap-5 items-start shadow">
      <div className="w-10 h-10 flex items-center justify-center bg-opacity-20 rounded-full">{icon}</div>
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-lg text-white font-semibold">{value}</span>
    </div>
  );
}
