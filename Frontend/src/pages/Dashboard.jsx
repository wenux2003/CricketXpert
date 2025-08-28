import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Brand from '../brand';

// Using shared Brand from ../brand

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
      {/* Header removed per request */}

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <nav className="space-y-2">
            <button
              onClick={() => navigate('/manager')}
              className="w-full text-left px-4 py-3 rounded-lg font-medium text-white"
              style={{ backgroundColor: Brand.primary }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = Brand.primaryHover; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = Brand.primary; }}
            >
              Manager View
            </button>
            <button
              onClick={() => navigate('/new-technician')}
              className="w-full text-left px-4 py-3 rounded-lg font-medium text-white"
              style={{ backgroundColor: Brand.primary }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = Brand.primaryHover; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = Brand.primary; }}
            >
              New Technician
            </button>
            <button
              onClick={() => navigate('/technician')}
              className="w-full text-left px-4 py-3 rounded-lg font-medium text-white"
              style={{ backgroundColor: Brand.primary }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = Brand.primaryHover; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = Brand.primary; }}
            >
              Technicians
            </button>
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

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md border p-6" style={{ borderColor: Brand.secondary }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: Brand.primary }}>Requests Trend</h3>
              <div className="h-64 flex items-end justify-between px-4">
                {[12,18,9,22,15,27].map((v,i) => (
                  <div key={i} className="w-9 rounded-t" style={{ height: `${v*6}px`, backgroundColor: i % 2 === 0 ? '#42ADF5' : '#2C8ED1' }} />
                ))}
              </div>
              <div className="mt-3 text-sm" style={{ color: Brand.body }}>Last 6 months</div>
            </div>
            <div className="bg-white rounded-xl shadow-md border p-6" style={{ borderColor: Brand.secondary }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: Brand.primary }}>Status Distribution</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="relative" style={{ width: 220, height: 220 }}>
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <path d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="4" />
                    <path d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#42ADF5" strokeWidth="4" strokeDasharray="40 60" />
                    <path d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#10B981" strokeWidth="4" strokeDasharray="20 80" strokeDashoffset="40" />
                  </svg>
                </div>
              </div>
              <div className="mt-3 text-sm" style={{ color: Brand.body }}>Pending vs In Progress vs Completed</div>
            </div>
          </div>

          {/* No table or search here per request */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
