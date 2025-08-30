import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Profile() {
  const [enrollments, setEnrollments] = useState([]);
  const [activeTab, setActiveTab] = useState('enrollments');
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    joinDate: '2024-01-15',
    membershipType: 'Premium'
  });

  useEffect(() => {
    // Load enrollments from localStorage
    const savedEnrollments = JSON.parse(localStorage.getItem('userEnrollments') || '[]');
    setEnrollments(savedEnrollments);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCancelEnrollment = (enrollmentId) => {
    if (window.confirm('Are you sure you want to cancel this enrollment?')) {
      const updatedEnrollments = enrollments.map(enrollment =>
        enrollment.id === enrollmentId
          ? { ...enrollment, status: 'cancelled' }
          : enrollment
      );
      setEnrollments(updatedEnrollments);
      localStorage.setItem('userEnrollments', JSON.stringify(updatedEnrollments));
    }
  };

  const activeEnrollments = enrollments.filter(e => e.status === 'active' || e.status === 'pending');
  const completedEnrollments = enrollments.filter(e => e.status === 'completed');
  const cancelledEnrollments = enrollments.filter(e => e.status === 'cancelled');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0D13CC] to-[#42ADF5] text-white rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold mr-6">
                {userInfo.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {userInfo.name}!</h1>
                <p className="text-blue-100">Member since {formatDate(userInfo.joinDate)}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-[#D88717] px-4 py-2 rounded-lg font-semibold">
                {userInfo.membershipType} Member
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Menu</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('enrollments')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'enrollments'
                      ? 'bg-[#0D13CC] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  📚 My Enrollments
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-[#0D13CC] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  👤 Personal Info
                </button>
                <button
                  onClick={() => setActiveTab('progress')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'progress'
                      ? 'bg-[#0D13CC] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  📈 Progress
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-[#0D13CC] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  ⚙️ Settings
                </button>
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Enrollments:</span>
                  <span className="font-semibold text-[#0D13CC]">{enrollments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Programs:</span>
                  <span className="font-semibold text-[#D88717]">{activeEnrollments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-semibold text-green-600">{completedEnrollments.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'enrollments' && (
              <div>
                {/* Enrollments Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="text-3xl font-bold text-[#0D13CC] mb-2">{activeEnrollments.length}</div>
                    <div className="text-gray-600">Active Enrollments</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{completedEnrollments.length}</div>
                    <div className="text-gray-600">Completed Programs</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="text-3xl font-bold text-[#D88717] mb-2">{enrollments.length}</div>
                    <div className="text-gray-600">Total Enrollments</div>
                  </div>
                </div>

                {/* Enrollments List */}
                <div className="bg-white rounded-xl shadow-lg">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-gray-800">My Enrollments</h2>
                      <Link
                        to="/enrollment"
                        className="bg-[#D88717] hover:bg-[#D88717]/80 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        + New Enrollment
                      </Link>
                    </div>
                  </div>

                  <div className="p-6">
                    {enrollments.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🏏</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Enrollments Yet</h3>
                        <p className="text-gray-600 mb-6">Start your cricket journey by enrolling in a program!</p>
                        <Link
                          to="/program"
                          className="bg-[#0D13CC] hover:bg-[#0D13CC]/80 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                          Browse Programs
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {enrollments.map((enrollment) => (
                          <div key={enrollment.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-3">
                                  <h3 className="text-xl font-bold text-gray-800 mr-4">
                                    {enrollment.program?.title || 'Unknown Program'}
                                  </h3>
                                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(enrollment.status)}`}>
                                    {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                                  <div>
                                    <span className="font-semibold">Enrolled:</span><br />
                                    {formatDate(enrollment.enrollmentDate)}
                                  </div>
                                  <div>
                                    <span className="font-semibold">Start Date:</span><br />
                                    {formatDate(enrollment.preferredStartDate)}
                                  </div>
                                  <div>
                                    <span className="font-semibold">Duration:</span><br />
                                    {enrollment.program?.duration || 'N/A'}
                                  </div>
                                  <div>
                                    <span className="font-semibold">Price:</span><br />
                                    <span className="text-[#D88717] font-bold">{enrollment.program?.price || 'N/A'}</span>
                                  </div>
                                </div>

                                {enrollment.experience && (
                                  <div className="mt-3">
                                    <span className="text-sm font-semibold text-gray-700">Experience Level: </span>
                                    <span className="text-sm text-gray-600 capitalize">{enrollment.experience}</span>
                                  </div>
                                )}

                                {enrollment.goals && (
                                  <div className="mt-2">
                                    <span className="text-sm font-semibold text-gray-700">Goals: </span>
                                    <span className="text-sm text-gray-600">{enrollment.goals}</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0 lg:ml-6">
                                {enrollment.status === 'pending' && (
                                  <button
                                    onClick={() => handleCancelEnrollment(enrollment.id)}
                                    className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-medium transition-colors"
                                  >
                                    Cancel
                                  </button>
                                )}
                                <Link
                                  to={`/program/${enrollment.program?.id || 1}`}
                                  className="px-4 py-2 bg-[#42ADF5] hover:bg-[#42ADF5]/80 text-white rounded-lg font-medium transition-colors text-center"
                                >
                                  View Program
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={userInfo.name}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={userInfo.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={userInfo.phone}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Member Since</label>
                    <input
                      type="text"
                      value={formatDate(userInfo.joinDate)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent"
                      readOnly
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button className="bg-[#0D13CC] hover:bg-[#0D13CC]/80 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    Edit Profile
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Training Progress</h2>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Progress Tracking Coming Soon</h3>
                  <p className="text-gray-600">We're working on detailed progress tracking features for your training programs.</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 text-[#0D13CC] focus:ring-[#42ADF5]" defaultChecked />
                        <span className="text-gray-700">Email notifications for program updates</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 text-[#0D13CC] focus:ring-[#42ADF5]" defaultChecked />
                        <span className="text-gray-700">SMS reminders for training sessions</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 text-[#0D13CC] focus:ring-[#42ADF5]" />
                        <span className="text-gray-700">Marketing communications</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Privacy</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 text-[#0D13CC] focus:ring-[#42ADF5]" defaultChecked />
                        <span className="text-gray-700">Make my profile visible to coaches</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 text-[#0D13CC] focus:ring-[#42ADF5]" />
                        <span className="text-gray-700">Share progress with other students</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <button className="bg-[#0D13CC] hover:bg-[#0D13CC]/80 text-white px-6 py-3 rounded-lg font-semibold transition-colors mr-4">
                      Save Settings
                    </button>
                    <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-colors">
                      Reset to Default
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
