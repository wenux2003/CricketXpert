import React from 'react';
import { useNavigate } from 'react-router-dom';

const Brand = {
  primary: '#072679',
  secondary: '#42ADF5',
  heading: '#000000',
  body: '#36516C',
  light: '#F1F2F7',
  accent: '#D88717',
};

const StatCard = ({ title, value, icon, note }) => (
  <div className="rounded-xl shadow-md p-5 bg-white border" style={{ borderColor: Brand.secondary }}>
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-sm font-semibold" style={{ color: Brand.body }}>{title}</h4>
      <div className="text-lg" style={{ color: Brand.secondary }}>{icon}</div>
    </div>
    <div className="text-3xl font-bold" style={{ color: Brand.primary }}>{value}</div>
    {note && <div className="text-xs mt-1" style={{ color: Brand.body }}>{note}</div>}
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: Brand.light }}>
      {/* Top Bar */}
      <header className="w-full bg-white border-b" style={{ borderColor: Brand.secondary }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🏏</span>
            <span className="text-2xl font-bold" style={{ color: Brand.primary }}>CricketXpert</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: Brand.secondary }}
              onClick={() => navigate('/')}
            >
              New Repair
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: Brand.accent }}
              onClick={() => navigate('/manager')}
            >
              Manager View
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <nav className="space-y-2">
            {[
              { label: 'Dashboard', path: '/dashboard' },
              { label: 'Requests', path: '/manager' },
              { label: 'Technicians', path: '/technician' },
              { label: 'Customers', path: '/repair' },
              { label: 'Notifications', path: '#' },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => item.path !== '#' && navigate(item.path)}
                className="w-full text-left px-4 py-3 rounded-lg font-medium hover:opacity-95"
                style={{ backgroundColor: '#FFFFFF', color: Brand.body, border: `1px solid ${Brand.secondary}` }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold" style={{ color: Brand.primary }}>Dashboard</h1>
            <p className="mt-1" style={{ color: Brand.body }}>Overview of repair operations</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Requests" value="48" icon="📦" note="All time" />
            <StatCard title="Pending" value="7" icon="⏳" note="Awaiting review" />
            <StatCard title="In Progress" value="12" icon="🔧" note="Assigned to technicians" />
            <StatCard title="Completed" value="29" icon="✅" note="Ready for pickup" />
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-xl shadow-md p-4 border mb-6" style={{ borderColor: Brand.secondary }}>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Search repairs by customer, damage type or status..."
                className="flex-1 px-4 py-2 rounded-lg border focus:outline-none"
                style={{ borderColor: Brand.secondary, color: Brand.body }}
              />
              <select className="px-4 py-2 rounded-lg border" style={{ borderColor: Brand.secondary, color: Brand.body }}>
                <option>All Status</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              <button className="px-4 py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: Brand.secondary }}>Filter</button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-md border overflow-hidden" style={{ borderColor: Brand.secondary }}>
            <div className="px-5 py-3 font-semibold" style={{ color: Brand.primary }}>Recent Repair Requests</div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm" style={{ color: Brand.body, backgroundColor: Brand.light }}>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Damage Type</th>
                    <th className="px-5 py-3">Assigned</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[1,2,3,4,5].map((i) => (
                    <tr key={i} className="border-t" style={{ borderColor: Brand.light }}>
                      <td className="px-5 py-3" style={{ color: Brand.body }}>John Doe</td>
                      <td className="px-5 py-3" style={{ color: Brand.body }}>Bat Handle Damage</td>
                      <td className="px-5 py-3" style={{ color: Brand.body }}>Alex (Tech)</td>
                      <td className="px-5 py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#E8F6FE', color: Brand.secondary }}>In Progress</span>
                      </td>
                      <td className="px-5 py-3 space-x-2">
                        <button className="px-3 py-1 rounded-lg text-white text-sm" style={{ backgroundColor: Brand.secondary }}>View</button>
                        <button className="px-3 py-1 rounded-lg text-white text-sm" style={{ backgroundColor: Brand.accent }}>Update</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
