import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter, FiCalendar, FiClock, FiMapPin, FiUsers, FiLoader } from "react-icons/fi";
import { coachAPI, userAPI } from "../services/api";
import { transformCoachData, mergeCoachAndUserData } from "../utils/dataTransformers";
import { testBackendConnection, testCoachAPI, testUserAPI } from "../utils/testConnection";

// Fallback mock data for development/testing
const fallbackCoaches = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@cricketxpert.com",
    phone: "+94 71 234 5678",
    specialization: "Batting",
    experience: "8 years",
    status: "Active",
    assignedPlayers: 15,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    schedule: [
      {
        id: 1,
        day: "Monday",
        time: "09:00 AM - 11:00 AM",
        session: "Batting Practice",
        players: 8,
        location: "Main Ground",
        type: "Group Session"
      },
      {
        id: 2,
        day: "Wednesday",
        time: "02:00 PM - 04:00 PM",
        session: "Batting Technique",
        players: 5,
        location: "Indoor Nets",
        type: "Individual Training"
      },
      {
        id: 3,
        day: "Friday",
        time: "10:00 AM - 12:00 PM",
        session: "Match Practice",
        players: 12,
        location: "Main Ground",
        type: "Team Session"
      }
    ]
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@cricketxpert.com",
    phone: "+94 77 345 6789",
    specialization: "Bowling",
    experience: "6 years",
    status: "Active",
    assignedPlayers: 12,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    schedule: [
      {
        id: 4,
        day: "Tuesday",
        time: "08:00 AM - 10:00 AM",
        session: "Fast Bowling",
        players: 6,
        location: "Bowling Nets",
        type: "Group Session"
      },
      {
        id: 5,
        day: "Thursday",
        time: "03:00 PM - 05:00 PM",
        session: "Spin Bowling",
        players: 4,
        location: "Spin Nets",
        type: "Individual Training"
      }
    ]
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@cricketxpert.com",
    phone: "+94 76 456 7890",
    specialization: "Fielding",
    experience: "10 years",
    status: "Inactive",
    assignedPlayers: 8,
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    schedule: []
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@cricketxpert.com",
    phone: "+94 75 567 8901",
    specialization: "Wicket Keeping",
    experience: "7 years",
    status: "Active",
    assignedPlayers: 18,
    image: "https://randomuser.me/api/portraits/women/23.jpg",
    schedule: [
      {
        id: 6,
        day: "Monday",
        time: "02:00 PM - 04:00 PM",
        session: "Wicket Keeping Basics",
        players: 10,
        location: "Wicket Keeping Area",
        type: "Group Session"
      },
      {
        id: 7,
        day: "Wednesday",
        time: "09:00 AM - 11:00 AM",
        session: "Advanced Keeping",
        players: 6,
        location: "Main Ground",
        type: "Individual Training"
      },
      {
        id: 8,
        day: "Saturday",
        time: "10:00 AM - 12:00 PM",
        session: "Match Simulation",
        players: 15,
        location: "Main Ground",
        type: "Team Session"
      }
    ]
  }
];

export default function CoachesManagement() {
  const [coaches, setCoaches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCoach, setEditingCoach] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // overview, schedule
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch coaches data from backend
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch coaches from backend
        const coachesResponse = await coachAPI.getAllCoaches();
        
        if (coachesResponse.success) {
          // Transform backend data to frontend format
          const transformedCoaches = coachesResponse.data.map(transformCoachData);
          setCoaches(transformedCoaches);
        } else {
          throw new Error('Failed to fetch coaches');
        }
      } catch (err) {
        console.error('Error fetching coaches:', err);
        setError(err.message);
        // Fallback to mock data if backend fails
        setCoaches(fallbackCoaches);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  // Filter coaches based on search and status
  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coach.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coach.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || coach.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEditCoach = (coach) => {
    setEditingCoach({ ...coach });
    setShowEditModal(true);
  };

  const handleUpdateCoach = async () => {
    if (editingCoach) {
      try {
        // Update coach in backend
        const coachData = {
          specialization: editingCoach.specialization.split(', '),
          experienceYears: parseInt(editingCoach.experience.match(/\d+/)?.[0] || '0'),
          status: editingCoach.status.toLowerCase()
        };

        const response = await coachAPI.updateCoach(editingCoach.id, coachData);
        
        if (response.success) {
          // Update local state
          setCoaches(coaches.map(coach => 
            coach.id === editingCoach.id ? editingCoach : coach
          ));
          setShowEditModal(false);
          setEditingCoach(null);
        } else {
          throw new Error('Failed to update coach');
        }
      } catch (err) {
        console.error('Error updating coach:', err);
        alert(`Failed to update coach: ${err.message}`);
      }
    }
  };

  const handleDeleteCoach = async (coachId) => {
    if (window.confirm("Are you sure you want to remove this coach?")) {
      try {
        const response = await coachAPI.deleteCoach(coachId);
        
        if (response.success) {
          setCoaches(coaches.filter(coach => coach.id !== coachId));
        } else {
          throw new Error('Failed to delete coach');
        }
      } catch (err) {
        console.error('Error deleting coach:', err);
        alert(`Failed to delete coach: ${err.message}`);
      }
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const coachesResponse = await coachAPI.getAllCoaches();
      
      if (coachesResponse.success) {
        const transformedCoaches = coachesResponse.data.map(transformCoachData);
        setCoaches(transformedCoaches);
      } else {
        throw new Error('Failed to fetch coaches');
      }
    } catch (err) {
      console.error('Error refreshing coaches:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      console.log('Testing backend connections...');
      
      // Test basic connection
      const basicTest = await testBackendConnection();
      console.log('Basic connection test:', basicTest);
      
      // Test coach API
      const coachTest = await testCoachAPI();
      console.log('Coach API test:', coachTest);
      
      // Test user API
      const userTest = await testUserAPI();
      console.log('User API test:', userTest);
      
      alert('Check console for test results!');
    } catch (err) {
      console.error('Test failed:', err);
      alert(`Test failed: ${err.message}`);
    }
  };

  const handleAddCoach = async (newCoach) => {
    try {
      // First create a user account
      const userData = {
        username: newCoach.email.split('@')[0],
        email: newCoach.email,
        passwordHash: 'tempPassword123', // In production, this should be properly hashed
        role: 'coach',
        firstName: newCoach.name.split(' ')[0] || newCoach.name,
        lastName: newCoach.name.split(' ').slice(1).join(' ') || '',
        contactNumber: newCoach.phone,
        status: 'active'
      };

      const userResponse = await userAPI.createUser(userData);
      
      if (userResponse.success) {
        // Then create the coach profile
        const coachData = {
          UserId: userResponse.data._id,
          specialization: newCoach.specialization.split(', '),
          experienceYears: parseInt(newCoach.experience.match(/\d+/)?.[0] || '0'),
          hourlyRate: 50, // Default hourly rate
          availability: [],
          status: 'active',
          bio: ''
        };

        const coachResponse = await coachAPI.createCoach(coachData);
        
        if (coachResponse.success) {
          // Transform and add to local state
          const transformedCoach = transformCoachData(coachResponse.data);
          setCoaches([...coaches, transformedCoach]);
          setShowAddModal(false);
        } else {
          throw new Error('Failed to create coach profile');
        }
      } else {
        throw new Error('Failed to create user account');
      }
    } catch (err) {
      console.error('Error adding coach:', err);
      alert(`Failed to add coach: ${err.message}`);
    }
  };

  const handleViewSchedule = (coach) => {
    setSelectedCoach(coach);
    setShowScheduleModal(true);
  };

  const getDayColor = (day) => {
    const colors = {
      'Monday': 'bg-blue-500',
      'Tuesday': 'bg-green-500',
      'Wednesday': 'bg-yellow-500',
      'Thursday': 'bg-purple-500',
      'Friday': 'bg-red-500',
      'Saturday': 'bg-indigo-500',
      'Sunday': 'bg-gray-500'
    };
    return colors[day] || 'bg-gray-500';
  };

  return (
    <div className="flex min-h-screen bg-[#24253b]">
      <Sidebar />
      <main className="flex-1 flex flex-col px-10 py-6">
        <Topbar />
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Coaches Management</h1>
            <p className="text-gray-400">Manage your cricket coaching team, assignments and schedules</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleTestConnection}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors"
              title="Test Backend Connection"
            >
              🧪 Test
            </button>
            <button
              onClick={handleRefresh}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors"
            >
              <FiLoader size={20} />
              Refresh
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors"
            >
              <FiPlus size={20} />
              Add New Coach
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="bg-[#1d2032] rounded-2xl p-8 mb-8 shadow text-center">
            <FiLoader className="animate-spin mx-auto mb-4" size={48} />
            <p className="text-white text-lg">Loading coaches data...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-2xl p-6 mb-8 shadow">
            <p className="text-red-400 text-center">
              Error: {error}. Using fallback data.
            </p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === "overview"
                ? "bg-indigo-600 text-white"
                : "bg-[#1d2032] text-gray-400 hover:bg-[#23263c]"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === "schedule"
                ? "bg-indigo-600 text-white"
                : "bg-[#1d2032] text-gray-400 hover:bg-[#23263c]"
            }`}
          >
            <FiCalendar className="inline mr-2" size={18} />
            Schedule View
          </button>
        </div>

        {activeTab === "overview" ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-[#1d2032] rounded-2xl p-6 shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Coaches</p>
                    <p className="text-2xl font-bold text-white">{coaches.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 text-xl">👥</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1d2032] rounded-2xl p-6 shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Coaches</p>
                    <p className="text-2xl font-bold text-white">{coaches.filter(c => c.status === "Active").length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 text-xl">✅</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1d2032] rounded-2xl p-6 shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Players</p>
                    <p className="text-2xl font-bold text-white">{coaches.reduce((sum, coach) => sum + coach.assignedPlayers, 0)}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-xl">🏏</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1d2032] rounded-2xl p-6 shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Sessions</p>
                    <p className="text-2xl font-bold text-white">{coaches.reduce((sum, coach) => sum + coach.schedule.length, 0)}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-yellow-400 text-xl">📅</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-[#1d2032] rounded-2xl p-6 mb-8 shadow">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search coaches by name, email, or specialization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#23263c] border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <FiFilter className="text-gray-400" size={20} />
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
              <h3 className="text-xl font-semibold text-white mb-6">Assigned Coaches</h3>
              
              {filteredCoaches.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No coaches found matching your criteria</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-gray-300">
                    <thead>
                      <tr className="text-sm font-medium text-gray-400 border-b border-gray-700">
                        <th className="p-4 text-left">Coach</th>
                        <th className="p-4 text-left">Contact</th>
                        <th className="p-4 text-left">Specialization</th>
                        <th className="p-4 text-left">Experience</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Players</th>
                        <th className="p-4 text-left">Sessions</th>
                        <th className="p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCoaches.map((coach) => (
                        <tr key={coach.id} className="border-b border-gray-700 hover:bg-[#23263c] transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={coach.image} alt={coach.name} className="w-10 h-10 rounded-full" />
                              <div>
                                <p className="text-white font-medium">{coach.name}</p>
                                <p className="text-sm text-gray-400">ID: {coach.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="text-white">{coach.email}</p>
                              <p className="text-sm text-gray-400">{coach.phone}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-400 rounded-full text-sm">
                              {coach.specialization}
                            </span>
                          </td>
                          <td className="p-4 text-white">{coach.experience}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              coach.status === "Active" 
                                ? "bg-green-500 bg-opacity-20 text-green-400" 
                                : "bg-red-500 bg-opacity-20 text-red-400"
                            }`}>
                              {coach.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-white font-medium">{coach.assignedPlayers}</span>
                            <span className="text-gray-400 text-sm ml-1">players</span>
                          </td>
                          <td className="p-4">
                            <span className="text-white font-medium">{coach.schedule.length}</span>
                            <span className="text-gray-400 text-sm ml-1">sessions</span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewSchedule(coach)}
                                className="p-2 bg-green-500 bg-opacity-20 text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition-colors"
                                title="View Schedule"
                              >
                                <FiCalendar size={16} />
                              </button>
                              <button
                                onClick={() => handleEditCoach(coach)}
                                className="p-2 bg-blue-500 bg-opacity-20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                                title="Edit Coach"
                              >
                                <FiEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteCoach(coach.id)}
                                className="p-2 bg-red-500 bg-opacity-20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                title="Delete Coach"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Schedule View */
          <div className="space-y-6">
            {/* Weekly Schedule Overview */}
            <div className="bg-[#1d2032] rounded-2xl p-6 shadow">
              <h3 className="text-xl font-semibold text-white mb-6">Weekly Schedule Overview</h3>
              <div className="grid grid-cols-7 gap-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                  const daySessions = coaches.flatMap(coach => 
                    coach.schedule.filter(session => session.day === day)
                  );
                  return (
                    <div key={day} className="text-center">
                      <div className={`${getDayColor(day)} text-white text-sm font-semibold py-2 px-3 rounded-t-lg`}>
                        {day.slice(0, 3)}
                      </div>
                      <div className="bg-[#23263c] p-3 rounded-b-lg min-h-[120px]">
                        {daySessions.length > 0 ? (
                          <div className="space-y-2">
                            {daySessions.slice(0, 3).map((session, index) => (
                              <div key={index} className="text-xs bg-indigo-500 bg-opacity-20 text-indigo-300 p-2 rounded">
                                <div className="font-medium">{session.session}</div>
                                <div className="text-gray-400">{session.time}</div>
                              </div>
                            ))}
                            {daySessions.length > 3 && (
                              <div className="text-xs text-gray-400">
                                +{daySessions.length - 3} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-xs py-4">No sessions</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Individual Coach Schedules */}
            <div className="bg-[#1d2032] rounded-2xl p-6 shadow">
              <h3 className="text-xl font-semibold text-white mb-6">Individual Coach Schedules</h3>
              <div className="space-y-6">
                {filteredCoaches.map((coach) => (
                  <div key={coach.id} className="border border-gray-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img src={coach.image} alt={coach.name} className="w-12 h-12 rounded-full" />
                        <div>
                          <h4 className="text-white font-semibold">{coach.name}</h4>
                          <p className="text-gray-400 text-sm">{coach.specialization} • {coach.schedule.length} sessions</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewSchedule(coach)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        View Full Schedule
                      </button>
                    </div>
                    
                    {coach.schedule.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {coach.schedule.map((session) => (
                          <div key={session.id} className="bg-[#23263c] p-3 rounded-lg border-l-4 border-indigo-500">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`${getDayColor(session.day)} text-white text-xs px-2 py-1 rounded-full`}>
                                {session.day}
                              </span>
                              <span className="text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded">
                                {session.type}
                              </span>
                            </div>
                            <h5 className="text-white font-medium text-sm mb-1">{session.session}</h5>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <FiClock size={12} />
                              {session.time}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                              <FiMapPin size={12} />
                              {session.location}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                              <FiUsers size={12} />
                              {session.players} players
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="col-span-full text-center py-8 text-gray-400">
                        <FiCalendar size={48} className="mx-auto mb-2 opacity-50" />
                        <p className="text-lg">No sessions scheduled</p>
                        <p className="text-sm">This coach is available for new assignments</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Edit Coach Modal */}
        {showEditModal && editingCoach && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1d2032] rounded-2xl p-8 w-full max-w-md">
              <h3 className="text-xl font-semibold text-white mb-6">Edit Coach</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Name</label>
                  <input
                    type="text"
                    value={editingCoach.name}
                    onChange={(e) => setEditingCoach({...editingCoach, name: e.target.value})}
                    className="w-full px-4 py-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={editingCoach.email}
                    onChange={(e) => setEditingCoach({...editingCoach, email: e.target.value})}
                    className="w-full px-4 py-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Phone</label>
                  <input
                    type="text"
                    value={editingCoach.phone}
                    onChange={(e) => setEditingCoach({...editingCoach, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Specialization</label>
                  <select
                    value={editingCoach.specialization}
                    onChange={(e) => setEditingCoach({...editingCoach, specialization: e.target.value})}
                    className="w-full px-4 py-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Batting">Batting</option>
                    <option value="Bowling">Bowling</option>
                    <option value="Fielding">Fielding</option>
                    <option value="Wicket Keeping">Wicket Keeping</option>
                    <option value="All Rounder">All Rounder</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Experience</label>
                  <input
                    type="text"
                    value={editingCoach.experience}
                    onChange={(e) => setEditingCoach({...editingCoach, experience: e.target.value})}
                    className="w-full px-4 py-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Status</label>
                  <select
                    value={editingCoach.status}
                    onChange={(e) => setEditingCoach({...editingCoach, status: e.target.value})}
                    className="w-full px-4 py-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleUpdateCoach}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  Update Coach
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Coach Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1d2032] rounded-2xl p-8 w-full max-w-md">
              <h3 className="text-xl font-semibold text-white mb-6">Add New Coach</h3>
              
              <AddCoachForm onSubmit={handleAddCoach} onCancel={() => setShowAddModal(false)} />
            </div>
          </div>
        )}

        {/* Schedule Detail Modal */}
        {showScheduleModal && selectedCoach && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1d2032] rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">
                  {selectedCoach.name}'s Schedule
                </h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCoach.schedule.length > 0 ? (
                  selectedCoach.schedule.map((session) => (
                    <div key={session.id} className="bg-[#23263c] p-4 rounded-lg border-l-4 border-indigo-500">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`${getDayColor(session.day)} text-white text-sm px-3 py-1 rounded-full`}>
                          {session.day}
                        </span>
                        <span className="text-sm text-gray-400 bg-gray-600 px-2 py-1 rounded">
                          {session.type}
                        </span>
                      </div>
                      <h5 className="text-white font-semibold text-lg mb-2">{session.session}</h5>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <FiClock size={16} />
                          {session.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <FiMapPin size={16} />
                          {session.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <FiUsers size={16} />
                          {session.players} players assigned
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-400">
                    <FiCalendar size={64} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No sessions scheduled for {selectedCoach.name}</p>
                    <p className="text-sm">This coach is available for new assignments</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function AddCoachForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "Batting",
    experience: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-400 text-sm mb-2">Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-4 py-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
        />
      </div>
      
      <div>
        <label className="block text-gray-400 text-sm mb-2">Email</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full px-4 py-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
        />
      </div>
      
      <div>
        <label className="block text-gray-400 text-sm mb-2">Phone</label>
        <input
          type="text"
          required
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full px-4 py-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
        />
      </div>
      
      <div>
        <label className="block text-gray-400 text-sm mb-2">Specialization</label>
        <select
          value={formData.specialization}
          onChange={(e) => setFormData({...formData, specialization: e.target.value})}
          className="w-full px-4 py-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="Batting">Batting</option>
          <option value="Bowling">Bowling</option>
          <option value="Fielding">Fielding</option>
          <option value="Wicket Keeping">Wicket Keeping</option>
          <option value="All Rounder">All Rounder</option>
        </select>
      </div>
      
      <div>
        <label className="block text-gray-400 text-sm mb-2">Experience</label>
        <input
          type="text"
          required
          placeholder="e.g., 5 years"
          value={formData.experience}
          onChange={(e) => setFormData({...formData, experience: e.target.value})}
          className="w-full px-4 py-3 bg-[#23263c] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
        />
      </div>
      
      <div className="flex gap-3 mt-8">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-colors"
        >
          Add Coach
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
