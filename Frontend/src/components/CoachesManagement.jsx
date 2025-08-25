import { useState, useEffect } from 'react';
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { FiUsers, FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter, FiCalendar, FiClock, FiUser, FiMapPin } from "react-icons/fi";

export default function CoachesManagement() {
  const [coaches, setCoaches] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@cricketxpert.com",
      specialization: "Batting Coach",
      experience: "8 years",
      status: "Active",
      assignedPlayers: 15,
      rating: 4.8,
      phone: "+94 71 234 5678",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      schedule: [
        {
          id: 1,
          day: "Monday",
          time: "09:00 AM - 11:00 AM",
          session: "Batting Practice",
          players: ["Alex Johnson", "Mike Davis", "Sarah Wilson"],
          location: "Main Ground",
          type: "Group Session"
        },
        {
          id: 2,
          day: "Monday",
          time: "02:00 PM - 04:00 PM",
          session: "Technique Analysis",
          players: ["David Brown"],
          location: "Indoor Facility",
          type: "Individual Session"
        },
        {
          id: 3,
          day: "Wednesday",
          time: "10:00 AM - 12:00 PM",
          session: "Power Hitting",
          players: ["Emma Thompson", "James Wilson", "Lisa Garcia"],
          location: "Practice Nets",
          type: "Group Session"
        },
        {
          id: 4,
          day: "Friday",
          time: "03:00 PM - 05:00 PM",
          session: "Match Simulation",
          players: ["Tom Anderson", "Rachel Green", "Chris Lee"],
          location: "Main Ground",
          type: "Group Session"
        }
      ]
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@cricketxpert.com",
      specialization: "Bowling Coach",
      experience: "6 years",
      status: "Active",
      assignedPlayers: 12,
      rating: 4.6,
      phone: "+94 72 345 6789",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      schedule: [
        {
          id: 1,
          day: "Tuesday",
          time: "09:00 AM - 11:00 AM",
          session: "Fast Bowling",
          players: ["Mark Johnson", "Steve Davis"],
          location: "Bowling Nets",
          type: "Group Session"
        },
        {
          id: 2,
          day: "Thursday",
          time: "02:00 PM - 04:00 PM",
          session: "Spin Bowling",
          players: ["Anna Smith", "Peter Wilson", "Maria Garcia"],
          location: "Practice Area",
          type: "Group Session"
        },
        {
          id: 3,
          day: "Saturday",
          time: "10:00 AM - 12:00 PM",
          session: "Bowling Analysis",
          players: ["Kevin Brown"],
          location: "Video Analysis Room",
          type: "Individual Session"
        }
      ]
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.brown@cricketxpert.com",
      specialization: "Fielding Coach",
      experience: "5 years",
      status: "Inactive",
      assignedPlayers: 8,
      rating: 4.4,
      phone: "+94 73 456 7890",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      schedule: []
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma.wilson@cricketxpert.com",
      specialization: "Fitness Coach",
      experience: "7 years",
      status: "Active",
      assignedPlayers: 20,
      rating: 4.9,
      phone: "+94 74 567 8901",
      image: "https://randomuser.me/api/portraits/women/23.jpg",
      schedule: [
        {
          id: 1,
          day: "Monday",
          time: "06:00 AM - 07:30 AM",
          session: "Morning Fitness",
          players: ["Team A - 8 players"],
          location: "Gym",
          type: "Group Session"
        },
        {
          id: 2,
          day: "Wednesday",
          time: "06:00 AM - 07:30 AM",
          session: "Strength Training",
          players: ["Team B - 6 players"],
          location: "Gym",
          type: "Group Session"
        },
        {
          id: 3,
          day: "Friday",
          time: "06:00 AM - 07:30 AM",
          session: "Cardio & Agility",
          players: ["Team C - 6 players"],
          location: "Outdoor Track",
          type: "Group Session"
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editingCoach, setEditingCoach] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'schedule'

  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coach.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || coach.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEditCoach = (coach) => {
    setEditingCoach({ ...coach });
  };

  const handleUpdateCoach = () => {
    if (editingCoach) {
      setCoaches(coaches.map(coach => 
        coach.id === editingCoach.id ? editingCoach : coach
      ));
      setEditingCoach(null);
    }
  };

  const handleDeleteCoach = (coachId) => {
    if (window.confirm('Are you sure you want to delete this coach?')) {
      setCoaches(coaches.filter(coach => coach.id !== coachId));
    }
  };

  const handleAddCoach = (newCoach) => {
    const coachWithId = {
      ...newCoach,
      id: Math.max(...coaches.map(c => c.id)) + 1,
      schedule: []
    };
    setCoaches([...coaches, coachWithId]);
    setShowAddModal(false);
  };

  const handleViewSchedule = (coach) => {
    setSelectedCoach(coach);
    setViewMode('schedule');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedCoach(null);
  };

  const getDayColor = (day) => {
    const colors = {
      'Monday': 'bg-blue-600',
      'Tuesday': 'bg-purple-600',
      'Wednesday': 'bg-green-600',
      'Thursday': 'bg-orange-600',
      'Friday': 'bg-red-600',
      'Saturday': 'bg-indigo-600',
      'Sunday': 'bg-gray-600'
    };
    return colors[day] || 'bg-gray-600';
  };

  if (viewMode === 'schedule' && selectedCoach) {
    return (
      <div className="flex min-h-screen bg-[#24253b]">
        <Sidebar />
        <main className="flex-1 flex flex-col px-10 py-6">
          <Topbar />
          
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBackToList}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold transition"
              >
                ← Back to Coaches
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{selectedCoach.name}'s Schedule</h1>
                <p className="text-gray-400">{selectedCoach.specialization} • {selectedCoach.experience}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img src={selectedCoach.image} alt={selectedCoach.name} className="w-12 h-12 rounded-full" />
              <div className="text-right">
                <p className="text-white font-medium">{selectedCoach.name}</p>
                <p className="text-sm text-gray-400">{selectedCoach.email}</p>
              </div>
            </div>
          </div>

          {/* Schedule Stats */}
          <section className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-[#21243a] rounded-2xl p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Sessions</p>
                  <p className="text-2xl font-bold text-white">{selectedCoach.schedule.length}</p>
                </div>
                <FiCalendar size={24} className="text-indigo-400" />
              </div>
            </div>
            <div className="bg-[#21243a] rounded-2xl p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">This Week</p>
                  <p className="text-2xl font-bold text-white">
                    {selectedCoach.schedule.filter(s => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(s.day)).length}
                  </p>
                </div>
                <FiClock size={24} className="text-green-400" />
              </div>
            </div>
            <div className="bg-[#21243a] rounded-2xl p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Group Sessions</p>
                  <p className="text-2xl font-bold text-white">
                    {selectedCoach.schedule.filter(s => s.type === 'Group Session').length}
                  </p>
                </div>
                <FiUsers size={24} className="text-purple-400" />
              </div>
            </div>
            <div className="bg-[#21243a] rounded-2xl p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Individual Sessions</p>
                  <p className="text-2xl font-bold text-white">
                    {selectedCoach.schedule.filter(s => s.type === 'Individual Session').length}
                  </p>
                </div>
                <FiUser size={24} className="text-yellow-400" />
              </div>
            </div>
          </section>

          {/* Weekly Schedule */}
          <div className="bg-[#1d2032] rounded-2xl p-6 shadow">
            <h3 className="text-xl text-white font-semibold mb-6">Weekly Schedule</h3>
            
            {selectedCoach.schedule.length === 0 ? (
              <div className="text-center py-12">
                <FiCalendar size={48} className="text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No sessions scheduled</p>
                <p className="text-gray-500 text-sm">This coach has no scheduled sessions for the week.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                  const daySessions = selectedCoach.schedule.filter(session => session.day === day);
                  return (
                    <div key={day} className="border border-gray-700 rounded-xl overflow-hidden">
                      <div className={`${getDayColor(day)} text-white px-6 py-3 font-semibold`}>
                        {day}
                      </div>
                      {daySessions.length === 0 ? (
                        <div className="px-6 py-4 text-gray-400 text-center">
                          No sessions scheduled
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-700">
                          {daySessions.map(session => (
                            <div key={session.id} className="px-6 py-4 hover:bg-[#23263c] transition">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-white font-medium">{session.session}</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      session.type === 'Group Session' 
                                        ? 'bg-purple-600 bg-opacity-20 text-purple-400' 
                                        : 'bg-yellow-600 bg-opacity-20 text-yellow-400'
                                    }`}>
                                      {session.type}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <div className="flex items-center gap-1">
                                      <FiClock size={14} />
                                      {session.time}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <FiMapPin size={14} />
                                      {session.location}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <FiUser size={14} />
                                      {session.players.length} player{session.players.length !== 1 ? 's' : ''}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-400 mb-1">Players:</div>
                                  <div className="text-xs text-gray-500 max-w-48">
                                    {session.players.join(', ')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#24253b]">
      <Sidebar />
      <main className="flex-1 flex flex-col px-10 py-6">
        <Topbar />
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Coaches Management</h1>
            <p className="text-gray-400">Manage and update your coaching staff</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition"
          >
            <FiPlus size={20} />
            Add New Coach
          </button>
        </div>

        {/* Stats Cards */}
        <section className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-[#21243a] rounded-2xl p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Coaches</p>
                <p className="text-2xl font-bold text-white">{coaches.length}</p>
              </div>
              <FiUsers size={24} className="text-indigo-400" />
            </div>
          </div>
          <div className="bg-[#21243a] rounded-2xl p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Coaches</p>
                <p className="text-2xl font-bold text-white">{coaches.filter(c => c.status === 'Active').length}</p>
              </div>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-[#21243a] rounded-2xl p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Players</p>
                <p className="text-2xl font-bold text-white">{coaches.reduce((sum, coach) => sum + coach.assignedPlayers, 0)}</p>
              </div>
              <FiUsers size={24} className="text-purple-400" />
            </div>
          </div>
          <div className="bg-[#21243a] rounded-2xl p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Rating</p>
                <p className="text-2xl font-bold text-white">
                  {(coaches.reduce((sum, coach) => sum + coach.rating, 0) / coaches.length).toFixed(1)}
                </p>
              </div>
              <div className="text-yellow-400 text-xl">⭐</div>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <div className="bg-[#1d2032] rounded-2xl p-6 mb-6 shadow">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search coaches by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#23263c] border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <FiFilter size={20} className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#23263c] border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Coaches Table */}
        <div className="bg-[#1d2032] rounded-2xl p-6 shadow">
          <h3 className="text-xl text-white font-semibold mb-6">Assigned Coaches</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-gray-300">
              <thead>
                <tr className="text-sm font-medium text-gray-400 border-b border-gray-700">
                  <th className="p-4 text-left">Coach</th>
                  <th className="p-4 text-left">Specialization</th>
                  <th className="p-4 text-left">Experience</th>
                  <th className="p-4 text-left">Assigned Players</th>
                  <th className="p-4 text-left">Rating</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Schedule</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoaches.map((coach) => (
                  <tr key={coach.id} className="border-b border-gray-700 hover:bg-[#23263c] transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={coach.image} alt={coach.name} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="text-white font-medium">{coach.name}</p>
                          <p className="text-sm text-gray-400">{coach.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-indigo-600 bg-opacity-20 text-indigo-400 px-3 py-1 rounded-full text-sm">
                        {coach.specialization}
                      </span>
                    </td>
                    <td className="p-4">{coach.experience}</td>
                    <td className="p-4">
                      <span className="bg-purple-600 bg-opacity-20 text-purple-400 px-3 py-1 rounded-full text-sm">
                        {coach.assignedPlayers} players
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span>{coach.rating}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        coach.status === 'Active' 
                          ? 'bg-green-600 bg-opacity-20 text-green-400' 
                          : 'bg-red-600 bg-opacity-20 text-red-400'
                      }`}>
                        {coach.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">
                          {coach.schedule.length} sessions
                        </span>
                        <button
                          onClick={() => handleViewSchedule(coach)}
                          className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
                          title="View Schedule"
                        >
                          <FiCalendar size={16} className="text-white" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCoach(coach)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                          title="Edit Coach"
                        >
                          <FiEdit size={16} className="text-white" />
                        </button>
                        <button
                          onClick={() => handleDeleteCoach(coach.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                          title="Delete Coach"
                        >
                          <FiTrash2 size={16} className="text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {editingCoach && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1d2032] rounded-2xl p-8 w-full max-w-md">
              <h3 className="text-xl text-white font-semibold mb-6">Edit Coach</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Name</label>
                  <input
                    type="text"
                    value={editingCoach.name}
                    onChange={(e) => setEditingCoach({...editingCoach, name: e.target.value})}
                    className="w-full p-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={editingCoach.email}
                    onChange={(e) => setEditingCoach({...editingCoach, email: e.target.value})}
                    className="w-full p-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Specialization</label>
                  <select
                    value={editingCoach.specialization}
                    onChange={(e) => setEditingCoach({...editingCoach, specialization: e.target.value})}
                    className="w-full p-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Batting Coach">Batting Coach</option>
                    <option value="Bowling Coach">Bowling Coach</option>
                    <option value="Fielding Coach">Fielding Coach</option>
                    <option value="Fitness Coach">Fitness Coach</option>
                    <option value="Wicket Keeping Coach">Wicket Keeping Coach</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Status</label>
                  <select
                    value={editingCoach.status}
                    onChange={(e) => setEditingCoach({...editingCoach, status: e.target.value})}
                    className="w-full p-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleUpdateCoach}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
                  >
                    Update Coach
                  </button>
                  <button
                    onClick={() => setEditingCoach(null)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Coach Modal */}
        {showAddModal && (
          <AddCoachModal onAdd={handleAddCoach} onClose={() => setShowAddModal(false)} />
        )}
      </main>
    </div>
  );
}

function AddCoachModal({ onAdd, onClose }) {
  const [newCoach, setNewCoach] = useState({
    name: '',
    email: '',
    specialization: 'Batting Coach',
    experience: '5 years',
    status: 'Active',
    assignedPlayers: 0,
    rating: 4.5,
    phone: '',
    image: 'https://randomuser.me/api/portraits/men/1.jpg'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newCoach);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1d2032] rounded-2xl p-8 w-full max-w-md">
        <h3 className="text-xl text-white font-semibold mb-6">Add New Coach</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Name</label>
            <input
              type="text"
              required
              value={newCoach.name}
              onChange={(e) => setNewCoach({...newCoach, name: e.target.value})}
              className="w-full p-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Email</label>
            <input
              type="email"
              required
              value={newCoach.email}
              onChange={(e) => setNewCoach({...newCoach, email: e.target.value})}
              className="w-full p-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Phone</label>
            <input
              type="tel"
              value={newCoach.phone}
              onChange={(e) => setNewCoach({...newCoach, phone: e.target.value})}
              className="w-full p-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Specialization</label>
            <select
              value={newCoach.specialization}
              onChange={(e) => setNewCoach({...newCoach, specialization: e.target.value})}
              className="w-full p-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Batting Coach">Batting Coach</option>
              <option value="Bowling Coach">Bowling Coach</option>
              <option value="Fielding Coach">Fielding Coach</option>
              <option value="Fitness Coach">Fitness Coach</option>
              <option value="Wicket Keeping Coach">Wicket Keeping Coach</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Experience</label>
            <select
              value={newCoach.experience}
              onChange={(e) => setNewCoach({...newCoach, experience: e.target.value})}
              className="w-full p-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
              <option value="3 years">3 years</option>
              <option value="4 years">4 years</option>
              <option value="5 years">5 years</option>
              <option value="6 years">6 years</option>
              <option value="7 years">7 years</option>
              <option value="8 years">8 years</option>
              <option value="9 years">9 years</option>
              <option value="10+ years">10+ years</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Add Coach
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
