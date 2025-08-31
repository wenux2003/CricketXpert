import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  BookOpen,
  Award,
  CreditCard,
  Download,
  Eye,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  Target,
  Users
} from 'lucide-react';
import { enrollmentsAPI, usersAPI, sessionsAPI } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import SessionBookingModal from '../components/SessionBookingModal';
import SessionManagementModal from '../components/SessionManagementModal';
import SessionCalendar, { SessionDetailModal } from '../components/SessionCalendar';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('enrollments');
  const [bookedSessions, setBookedSessions] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showManagementModal, setShowManagementModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [managementAction, setManagementAction] = useState('reschedule');
  const [showSessionDetail, setShowSessionDetail] = useState(false);
  const [selectedSessionForDetail, setSelectedSessionForDetail] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserEnrollments();
      fetchBookedSessions();
    }
  }, [isAuthenticated, user]);

  const fetchUserEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get enrollments from localStorage for demo mode
      const storedEnrollments = JSON.parse(localStorage.getItem(`enrollments_${user.id}`)) || [];
      setEnrollments(storedEnrollments);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
      setError(err.message);
      toast.error('Failed to load your enrollments');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedSessions = async () => {
    try {
      // Mock booked sessions data for demo
      const mockSessions = JSON.parse(localStorage.getItem(`bookedSessions_${user.id}`)) || [];
      setBookedSessions(mockSessions);
    } catch (err) {
      console.error('Error fetching booked sessions:', err);
    }
  };

  const handleBookSession = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = (sessionData) => {
    // Save to localStorage for demo
    const existingSessions = JSON.parse(localStorage.getItem(`bookedSessions_${user.id}`)) || [];
    existingSessions.push(sessionData);
    localStorage.setItem(`bookedSessions_${user.id}`, JSON.stringify(existingSessions));
    
    fetchBookedSessions();
    toast.success('Session booked successfully!');
  };

  const handleManageSession = (session, action) => {
    setSelectedSession(session);
    setManagementAction(action);
    setShowManagementModal(true);
  };

  const handleSessionUpdated = (updatedSession) => {
    // Update session in localStorage for demo
    const existingSessions = JSON.parse(localStorage.getItem(`bookedSessions_${user.id}`)) || [];
    const updatedSessions = existingSessions.map(session => 
      session._id === updatedSession._id ? updatedSession : session
    );
    localStorage.setItem(`bookedSessions_${user.id}`, JSON.stringify(updatedSessions));
    
    fetchBookedSessions();
  };

  const handleCalendarSessionClick = (session) => {
    setSelectedSessionForDetail(session);
    setShowSessionDetail(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'pending': return Clock;
      case 'completed': return Award;
      case 'cancelled': return XCircle;
      default: return AlertCircle;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="text-blue-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'User Profile'}</h1>
              <p className="text-lg text-gray-600 mt-1">{user?.email}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <Mail size={16} />
                  <span>{user?.email}</span>
                </span>
                {user?.phone && (
                  <span className="flex items-center space-x-1">
                    <Phone size={16} />
                    <span>{user?.phone}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('enrollments')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'enrollments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Enrollments
              </button>
              <button
                onClick={() => setActiveTab('sessions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sessions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Sessions
              </button>
              <button
                onClick={() => setActiveTab('certificates')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'certificates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Certificates
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Payment History
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'enrollments' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Enrollments</h2>
              <Link
                to="/programs"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Browse Programs
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading your enrollments...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="text-red-500" size={24} />
                  <div>
                    <h3 className="text-lg font-medium text-red-800">Error Loading Enrollments</h3>
                    <p className="text-red-600 mt-1">{error}</p>
                    <button
                      onClick={fetchUserEnrollments}
                      className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            ) : enrollments.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Enrollments Yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't enrolled in any programs yet. Explore our coaching programs to get started!
                </p>
                <Link
                  to="/programs"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Programs
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment) => {
                  const StatusIcon = getStatusIcon(enrollment.status);
                  return (
                    <div key={enrollment._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      {/* Program Image */}
                      <div className="relative h-32 bg-gradient-to-br from-blue-500 to-blue-600">
                        {enrollment.program?.imageUrl ? (
                          <img
                            src={enrollment.program.imageUrl}
                            alt={enrollment.program.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="text-white" size={32} />
                          </div>
                        )}
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                            {enrollment.status?.charAt(0).toUpperCase() + enrollment.status?.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {enrollment.program?.title || 'Program Title'}
                        </h3>
                        
                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar size={14} />
                            <span>Enrolled: {formatDate(enrollment.enrollmentDate)}</span>
                          </div>
                          
                          {enrollment.program?.duration && (
                            <div className="flex items-center space-x-2">
                              <Clock size={14} />
                              <span>{enrollment.program.duration.weeks} weeks • {enrollment.program.duration.sessionsPerWeek} sessions/week</span>
                            </div>
                          )}

                          <div className="flex items-center space-x-2">
                            <CreditCard size={14} />
                            <span>Paid: {formatPrice(enrollment.program?.price || 0)}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {enrollment.progress && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{enrollment.progress.progressPercentage || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${enrollment.progress.progressPercentage || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <Link
                            to={`/programs/${enrollment.program?._id}`}
                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-center text-sm font-medium"
                          >
                            View Program
                          </Link>
                          {enrollment.status === 'active' && (
                            <button 
                              onClick={() => handleBookSession(enrollment)}
                              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              Book Session
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'sessions' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Sessions</h2>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  {bookedSessions.length} session{bookedSessions.length !== 1 ? 's' : ''} booked
                </div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      viewMode === 'calendar' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Calendar
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading your sessions...</p>
              </div>
            ) : bookedSessions.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Sessions Booked</h3>
                <p className="text-gray-600 mb-6">
                  Book your first session from your enrolled programs to get started!
                </p>
                <button
                  onClick={() => setActiveTab('enrollments')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Enrollments
                </button>
              </div>
            ) : viewMode === 'calendar' ? (
              <SessionCalendar 
                sessions={bookedSessions} 
                onSessionClick={handleCalendarSessionClick}
              />
            ) : (
              <div className="space-y-4">
                {bookedSessions.map((session) => (
                  <div key={session._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {session.program?.title || 'Session'}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                            {session.status?.charAt(0).toUpperCase() + session.status?.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar size={16} />
                            <span>{formatDate(session.scheduledDate)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock size={16} />
                            <span>{session.startTime} - {session.endTime}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin size={16} />
                            <span>{session.ground?.name || 'Ground TBD'}</span>
                          </div>
                        </div>

                        {session.coach && (
                          <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
                            <User size={16} />
                            <span>Coach: {session.coach.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Session Actions */}
                      <div className="flex space-x-2 ml-4">
                        {session.status === 'scheduled' && (
                          <>
                            <button
                              onClick={() => handleManageSession(session, 'reschedule')}
                              className="px-3 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleManageSession(session, 'cancel')}
                              className="px-3 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {session.status === 'completed' && (
                          <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md text-sm font-medium cursor-not-allowed">
                            Completed
                          </button>
                        )}
                        {session.status === 'cancelled' && (
                          <button className="px-3 py-2 bg-red-100 text-red-600 rounded-md text-sm font-medium cursor-not-allowed">
                            Cancelled
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Session Notes or Feedback */}
                    {session.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-700">{session.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'certificates' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Certificates</h2>
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Certificates Yet</h3>
              <p className="text-gray-600">
                Complete your enrolled programs to earn certificates.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {enrollments.filter(e => e.paymentDetails).length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No Payment History</h3>
                  <p className="text-gray-600">
                    Your payment history will appear here after you make your first enrollment.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Program
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {enrollments.filter(e => e.paymentDetails).map((enrollment) => (
                        <tr key={enrollment._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {enrollment.program?.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatPrice(enrollment.program?.price || 0)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(enrollment.enrollmentDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Paid
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
                              <Download size={16} />
                              <span>Receipt</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Session Booking Modal */}
      {selectedEnrollment && (
        <SessionBookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedEnrollment(null);
          }}
          enrollment={selectedEnrollment}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Session Management Modal */}
      {selectedSession && (
        <SessionManagementModal
          isOpen={showManagementModal}
          onClose={() => {
            setShowManagementModal(false);
            setSelectedSession(null);
          }}
          session={selectedSession}
          action={managementAction}
          onSessionUpdated={handleSessionUpdated}
        />
      )}

      {/* Session Detail Modal */}
      <SessionDetailModal
        isOpen={showSessionDetail}
        onClose={() => {
          setShowSessionDetail(false);
          setSelectedSessionForDetail(null);
        }}
        session={selectedSessionForDetail}
      />
    </div>
  );
};

export default Profile;
