import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp,
  Loader2,
  AlertCircle,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  Send
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { programsAPI, sessionsAPI, enrollmentsAPI } from '../services/apiService';
import toast from 'react-hot-toast';

const CoachDashboard = () => {
  const { user, isAuthenticated, isCoach } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPrograms, setExpandedPrograms] = useState({});
  const [feedbackModal, setFeedbackModal] = useState({ open: false, enrollment: null });
  const [feedbackForm, setFeedbackForm] = useState({ comment: '', rating: 5 });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    // Temporarily bypass authentication for testing
    fetchCoachData();
    // if (isAuthenticated && isCoach() && user) {
    //   fetchCoachData();
    // }
  }, [isAuthenticated, user]);

  const fetchCoachData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get coach ID from user data or use Saman's ID as fallback
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const coachId = currentUser.coachId || '68b3f1916da0e54388cde2d5'; // Saman's coach ID as fallback
      
      // Fetch all programs and filter by coach
      const allProgramsResponse = await programsAPI.getAll();
      if (allProgramsResponse.success) {
        // Filter programs assigned to this coach
        const coachPrograms = (allProgramsResponse.data.docs || []).filter(
          program => program.coach?._id === coachId
        );
        
        setPrograms(coachPrograms);
        
        // Fetch sessions for each program
        const allSessions = [];
        const allEnrollments = [];
        
        for (const program of coachPrograms) {
          // Note: Sessions and enrollments APIs might not exist yet
          // For now, just show the programs
          try {
            const sessionsResponse = await sessionsAPI.getByProgram(program._id, {
              status: 'scheduled',
              sort: 'date'
            });
            
            if (sessionsResponse.success) {
              allSessions.push(...(sessionsResponse.data.docs || []));
            }
          } catch (err) {
            console.log('Sessions API not available:', err.message);
          }

          try {
            const enrollmentsResponse = await enrollmentsAPI.getAll({
              program: program._id,
              status: 'active'
            });
            
            if (enrollmentsResponse.success) {
              allEnrollments.push(...(enrollmentsResponse.data.docs || []));
            }
          } catch (err) {
            console.log('Enrollments API not available:', err.message);
          }
        }
        
        setSessions(allSessions);
        setEnrollments(allEnrollments);
      } else {
        throw new Error(allProgramsResponse.message || 'Failed to fetch programs');
      }
    } catch (err) {
      console.error('Error fetching coach data:', err);
      setError(err.message);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const toggleProgramExpansion = (programId) => {
    setExpandedPrograms(prev => ({
      ...prev,
      [programId]: !prev[programId]
    }));
  };

  const openFeedbackModal = (enrollment) => {
    setFeedbackModal({ open: true, enrollment });
    setFeedbackForm({ comment: '', rating: 5 });
  };

  const closeFeedbackModal = () => {
    setFeedbackModal({ open: false, enrollment: null });
    setFeedbackForm({ comment: '', rating: 5 });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedbackForm.comment.trim()) {
      toast.error('Please provide a comment');
      return;
    }

    try {
      setSubmittingFeedback(true);
      
      const response = await enrollmentsAPI.addFeedback(feedbackModal.enrollment._id, {
        comment: feedbackForm.comment.trim(),
        rating: feedbackForm.rating,
        coachId: user.id
      });

      if (response.success) {
        toast.success('Feedback submitted successfully');
        closeFeedbackModal();
        // Refresh data to show updated feedback
        fetchCoachData();
      } else {
        throw new Error(response.message || 'Failed to submit feedback');
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      toast.error(err.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const getUpcomingSessions = (programId) => {
    return sessions
      .filter(session => session.program === programId)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3); // Show next 3 sessions
  };

  const getProgramEnrollments = (programId) => {
    return enrollments.filter(enrollment => enrollment.program._id === programId);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const renderStarRating = (rating, onRatingChange = null) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={`${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${onRatingChange ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  // Temporarily bypass authentication for testing
  // if (!isAuthenticated) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center max-w-md">
  //         <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
  //         <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
  //         <p className="text-gray-600 mb-6">You need to be logged in to access the coach dashboard.</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!isCoach()) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center max-w-md">
  //         <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
  //         <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
  //         <p className="text-gray-600 mb-6">Only authenticated coaches can access this dashboard.</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">Coach Dashboard</h1>
              <p className="mt-2 text-lg text-gray-600">
                Welcome back, {JSON.parse(localStorage.getItem('user') || '{}')?.name || 'Coach'}! Manage your programs and track student progress.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Programs</p>
                  <p className="text-2xl font-bold text-blue-600">{programs.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Active Students</p>
                  <p className="text-2xl font-bold text-green-600">{enrollments.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h4>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchCoachData}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Programs Yet</h4>
            <p className="text-gray-600 mb-6">
              You haven't created any programs yet. Create your first program to start coaching!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Programs List */}
            {programs.map((program) => {
              const programSessions = getUpcomingSessions(program._id);
              const programEnrollments = getProgramEnrollments(program._id);
              const isExpanded = expandedPrograms[program._id];

              return (
                <div key={program._id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  {/* Program Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {program.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {program.description}
                        </p>
                        
                        {/* Program Stats */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Users size={16} />
                            <span>{programEnrollments.length} Students</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar size={16} />
                            <span>{programSessions.length} Upcoming Sessions</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock size={16} />
                            <span>{program.duration?.weeks || 0} Weeks</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Target size={16} />
                            <span>{program.skillLevel || 'All Levels'}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleProgramExpansion(program._id)}
                        className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="p-6 space-y-6">
                      {/* Upcoming Sessions */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <Calendar className="mr-2" size={20} />
                          Upcoming Sessions
                        </h4>
                        {programSessions.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">No upcoming sessions scheduled</p>
                        ) : (
                          <div className="grid gap-3">
                            {programSessions.map((session) => {
                              const { date, time } = formatDateTime(session.date);
                              return (
                                <div key={session._id} className="bg-gray-50 rounded-lg p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h5 className="font-medium text-gray-900">{session.title}</h5>
                                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                        <span>{date}</span>
                                        <span>{time}</span>
                                        <span>{session.ground?.name || 'TBD'}</span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm text-gray-600">Participants</p>
                                      <p className="font-medium">{session.participants?.length || 0}/{session.maxParticipants || 'N/A'}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Enrolled Students */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <Users className="mr-2" size={20} />
                          Enrolled Students
                        </h4>
                        {programEnrollments.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">No students enrolled yet</p>
                        ) : (
                          <div className="grid gap-3">
                            {programEnrollments.map((enrollment) => (
                              <div key={enrollment._id} className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                      <User className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                      <h5 className="font-medium text-gray-900">
                                        {enrollment.user?.name || 'Student'}
                                      </h5>
                                      <p className="text-sm text-gray-600">
                                        Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3">
                                    {/* Progress */}
                                    <div className="text-right">
                                      <p className="text-sm text-gray-600">Progress</p>
                                      <p className="font-medium text-blue-600">
                                        {enrollment.progress?.progressPercentage || 0}%
                                      </p>
                                    </div>
                                    
                                    {/* Feedback Button */}
                                    <button
                                      onClick={() => openFeedbackModal(enrollment)}
                                      className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors"
                                    >
                                      <MessageSquare size={16} />
                                      <span>Feedback</span>
                                    </button>
                                  </div>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="mt-3">
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${enrollment.progress?.progressPercentage || 0}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {feedbackModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Submit Feedback</h3>
              <button
                onClick={closeFeedbackModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Student: <span className="font-medium">{feedbackModal.enrollment?.user?.name}</span>
              </p>
              <p className="text-sm text-gray-600">
                Program: <span className="font-medium">{feedbackModal.enrollment?.program?.title}</span>
              </p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating (1-5 stars)
                </label>
                {renderStarRating(feedbackForm.rating, (rating) => 
                  setFeedbackForm(prev => ({ ...prev, rating }))
                )}
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={feedbackForm.comment}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide feedback on the student's progress, performance, and areas for improvement..."
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeFeedbackModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submittingFeedback ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Send size={16} />
                  )}
                  <span>{submittingFeedback ? 'Submitting...' : 'Submit Feedback'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachDashboard;





