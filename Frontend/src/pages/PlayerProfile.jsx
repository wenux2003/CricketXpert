import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  BookOpen,
  Clock,
  Star,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Target,
  Trophy,
  Activity
} from 'lucide-react';
import apiService from '../services/api';

const PlayerProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock user data - in real app, this would come from authentication context
  const user = {
    id: '60f1b2b0b3b4b4b4b4b4b4b4',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    contactNumber: '+94771234567',
    address: '123 Main Street, Colombo 03',
    dateOfBirth: '1995-06-15',
    joinDate: '2024-01-15',
    profileImage: '/api/placeholder/80/80'
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [
        enrollmentsResponse,
        certificatesResponse,
        notificationsResponse,
        dashboardResponse
      ] = await Promise.all([
        apiService.getUserEnrollments(user.id),
        apiService.getUserCertificates(user.id),
        apiService.getUserNotifications(user.id, { limit: 10 }),
        apiService.getUserDashboard(user.id)
      ]);

      setEnrollments(enrollmentsResponse.data || []);
      setCertificates(certificatesResponse.data || []);
      setNotifications(notificationsResponse.data || []);
      setDashboardData(dashboardResponse.data || null);
      setError(null);
    } catch (err) {
      setError('Failed to fetch user data');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      suspended: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(price);
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const downloadCertificate = async (certificateId) => {
    try {
      await apiService.downloadCertificate(certificateId);
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'programs', name: 'My Programs', icon: BookOpen },
    { id: 'certificates', name: 'Certificates', icon: Award },
    { id: 'progress', name: 'Progress', icon: BarChart3 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-20 h-20 rounded-full bg-gray-300"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} />
                  <span>{user.contactNumber}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>Age: {calculateAge(user.dateOfBirth)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>Joined: {formatDate(user.joinDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Programs</p>
                  <p className="text-2xl font-bold text-blue-600">{dashboardData.stats?.activeEnrollments || 0}</p>
                </div>
                <BookOpen className="text-blue-600" size={32} />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Programs</p>
                  <p className="text-2xl font-bold text-green-600">{dashboardData.stats?.completedPrograms || 0}</p>
                </div>
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Certificates</p>
                  <p className="text-2xl font-bold text-yellow-600">{dashboardData.stats?.totalCertificates || 0}</p>
                </div>
                <Award className="text-yellow-600" size={32} />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                  <p className="text-2xl font-bold text-purple-600">{Math.round(dashboardData.stats?.averageProgress || 0)}%</p>
                </div>
                <BarChart3 className="text-purple-600" size={32} />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="text-gray-400" size={16} />
                      <span className="text-gray-700">{user.firstName} {user.lastName}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="text-gray-400" size={16} />
                      <span className="text-gray-700">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="text-gray-400" size={16} />
                      <span className="text-gray-700">{user.contactNumber}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="text-gray-400" size={16} />
                      <span className="text-gray-700">{user.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="text-gray-400" size={16} />
                      <span className="text-gray-700">Born: {formatDate(user.dateOfBirth)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {notifications.slice(0, 5).map((notification, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
                        <div className={`p-1 rounded-full ${notification.isRead ? 'bg-gray-300' : 'bg-blue-500'}`}>
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Programs Tab */}
            {activeTab === 'programs' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Coaching Programs</h3>
                  <Link
                    to="/programs"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Browse Programs
                  </Link>
                </div>

                {enrollments.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No enrollments yet</h3>
                    <p className="text-gray-600 mb-4">Start your cricket journey by enrolling in a coaching program</p>
                    <Link
                      to="/programs"
                      className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Explore Programs
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrollments.map((enrollment) => (
                      <div key={enrollment._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">{enrollment.program.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                            {enrollment.status}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar size={14} />
                            <span>Enrolled: {formatDate(enrollment.enrollmentDate)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <User size={14} />
                            <span>{enrollment.program.coach?.userId?.firstName} {enrollment.program.coach?.userId?.lastName}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{enrollment.progress.progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${enrollment.progress.progressPercentage}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                            <span>{enrollment.progress.completedSessions} completed</span>
                            <span>{enrollment.progress.totalSessions} total sessions</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Link
                            to={`/programs/${enrollment.program._id}`}
                            className="flex-1 text-center bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm"
                          >
                            View Program
                          </Link>
                          {enrollment.status === 'active' && (
                            <Link
                              to={`/sessions?enrollment=${enrollment._id}`}
                              className="flex-1 text-center bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                            >
                              Book Session
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">My Certificates</h3>

                {certificates.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No certificates yet</h3>
                    <p className="text-gray-600">Complete coaching programs to earn certificates</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((certificate) => (
                      <div key={certificate._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Trophy className="text-yellow-500" size={20} />
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              certificate.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {certificate.status}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            #{certificate.certificateNumber.slice(-6)}
                          </span>
                        </div>

                        <h4 className="font-semibold text-gray-900 mb-2">{certificate.title}</h4>
                        <p className="text-sm text-gray-600 mb-4">{certificate.description}</p>

                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>Issued:</span>
                            <span>{formatDate(certificate.issueDate)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Grade:</span>
                            <span className="font-medium">{certificate.completionDetails?.finalGrade}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Attendance:</span>
                            <span>{certificate.completionDetails?.attendancePercentage}%</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => downloadCertificate(certificate._id)}
                            className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Download size={14} />
                            <span>Download</span>
                          </button>
                          <Link
                            to={`/certificates/${certificate._id}`}
                            className="flex items-center justify-center bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm"
                          >
                            <Eye size={14} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Learning Progress</h3>

                {dashboardData?.learningStreak && (
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
                    <div className="flex items-center space-x-4">
                      <Activity size={32} />
                      <div>
                        <h4 className="text-xl font-bold">{dashboardData.learningStreak} Day Streak!</h4>
                        <p className="text-blue-100">Keep up the great work with your consistent training</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Sessions */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Recent Sessions</h4>
                    <div className="space-y-3">
                      {dashboardData?.recentSessions?.slice(0, 5).map((session, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                          <CheckCircle className="text-green-500" size={16} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{session.title}</p>
                            <p className="text-xs text-gray-600">{session.program.title}</p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(session.scheduledDate)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Sessions */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Upcoming Sessions</h4>
                    <div className="space-y-3">
                      {dashboardData?.upcomingSessions?.slice(0, 5).map((session, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-md">
                          <Calendar className="text-blue-500" size={16} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{session.title}</p>
                            <p className="text-xs text-gray-600">{session.program.title}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-900 font-medium">
                              {formatDate(session.scheduledDate)}
                            </p>
                            <p className="text-xs text-gray-600">
                              {session.startTime} - {session.endTime}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
