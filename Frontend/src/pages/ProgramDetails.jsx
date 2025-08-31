import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  User,
  Users,
  Calendar,
  MapPin,
  CheckCircle,
  FileText,
  Video,
  ExternalLink,
  Star,
  Loader2,
  AlertCircle,
  BookOpen,
  Target,
  Award
} from 'lucide-react';
import { programsAPI, enrollmentsAPI } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import EnrollmentModal from '../components/EnrollmentModal';
import SuccessNotification from '../components/SuccessNotification';

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isCustomer } = useAuth();
  
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [userEnrollment, setUserEnrollment] = useState(null);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  useEffect(() => {
    fetchProgramDetails();
    if (isAuthenticated && user) {
      checkUserEnrollment();
    }
  }, [id, isAuthenticated, user]);

  const fetchProgramDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await programsAPI.getById(id);
      
      if (response.success) {
        setProgram(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch program details');
      }
    } catch (err) {
      console.error('Error fetching program details:', err);
      setError(err.message);
      toast.error('Failed to load program details');
    } finally {
      setLoading(false);
    }
  };

  const checkUserEnrollment = async () => {
    if (!user?.id) return;
    
    try {
      // Check enrollments from localStorage for demo mode
      const storedEnrollments = JSON.parse(localStorage.getItem(`enrollments_${user.id}`)) || [];
      const programEnrollment = storedEnrollments.find(enrollment => 
        enrollment.program._id === id || enrollment.program.id === id
      );
      
      if (programEnrollment) {
        setUserEnrollment(programEnrollment);
      }
    } catch (err) {
      console.error('Error checking enrollment:', err);
    }
  };

  const handleEnroll = () => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll in programs');
      return;
    }

    if (!isCustomer()) {
      toast.error('Only customers can enroll in programs');
      return;
    }

    setShowEnrollmentModal(true);
  };

  const handleEnrollmentSuccess = (enrollment) => {
    setUserEnrollment(enrollment);
    fetchProgramDetails(); // Refresh to update enrollment count
    setShowSuccessNotification(true);
    
    // Navigate to profile page after showing notification
    setTimeout(() => {
      navigate('/profile');
    }, 3000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMaterialIcon = (type) => {
    switch (type) {
      case 'video': return Video;
      case 'document': return FileText;
      case 'link': return ExternalLink;
      default: return FileText;
    }
  };

  const getEnrollmentStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading program details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Program</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={fetchProgramDetails}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/programs"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Programs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Program Not Found</h2>
          <p className="text-gray-600 mb-6">The program you're looking for doesn't exist.</p>
          <Link
            to="/programs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Programs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/programs')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Programs</span>
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Program Image */}
            <div className="lg:col-span-1">
              <div className="relative h-64 lg:h-80 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg overflow-hidden">
                {program.imageUrl ? (
                  <img
                    src={program.imageUrl}
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="text-white" size={64} />
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(program.difficulty)}`}>
                    {program.difficulty?.charAt(0).toUpperCase() + program.difficulty?.slice(1)}
                  </span>
                  <br />
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {program.category?.charAt(0).toUpperCase() + program.category?.slice(1)}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    program.isFull ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {program.isFull ? 'Full' : 'Available'}
                  </span>
                </div>
              </div>
            </div>

            {/* Program Info */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{program.title}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                  {program.specialization?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                {program.tags && program.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {program.description}
              </p>

              {/* Program Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">{program.duration?.weeks}</div>
                  <div className="text-sm text-gray-600">Weeks</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">{program.duration?.sessionsPerWeek}</div>
                  <div className="text-sm text-gray-600">Sessions/Week</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">{program.currentEnrollments || 0}/{program.maxParticipants}</div>
                  <div className="text-sm text-gray-600">Enrolled</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">{program.totalSessions}</div>
                  <div className="text-sm text-gray-600">Total Sessions</div>
                </div>
              </div>

              {/* Price and Enrollment */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(program.price)}
                    </span>
                    <span className="text-gray-600 ml-2">for the complete program</span>
                  </div>
                </div>

                {/* User Enrollment Status */}
                {userEnrollment && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="text-blue-600" size={20} />
                      <span className="font-medium text-blue-900">You are enrolled in this program</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-blue-700">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEnrollmentStatusColor(userEnrollment.status)}`}>
                        {userEnrollment.status?.charAt(0).toUpperCase() + userEnrollment.status?.slice(1)}
                      </span>
                    </div>
                    {userEnrollment.progress && (
                      <div className="mt-2">
                        <span className="text-sm text-blue-700">Progress: {userEnrollment.progress.progressPercentage || 0}%</span>
                        <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${userEnrollment.progress.progressPercentage || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Enrollment Button */}
                {isAuthenticated && isCustomer() && !userEnrollment && (
                  <button
                    onClick={handleEnroll}
                    disabled={program.isFull}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      program.isFull
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {program.isFull ? 'Program Full' : 'Enroll Now'}
                  </button>
                )}

                {!isAuthenticated && (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Please login to enroll in this program</p>
                    <Link
                      to="/login"
                      className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Login to Enroll
                    </Link>
                  </div>
                )}

                {isAuthenticated && !isCustomer() && (
                  <div className="text-center">
                    <p className="text-gray-600">Only customers can enroll in programs</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Program Details Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Coach Information */}
            {program.coach && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Coach</h2>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="text-blue-600" size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {program.coach?.userId ? `${program.coach.userId.firstName} ${program.coach.userId.lastName}` : 'Professional Coach'}
                    </h3>
                    <p className="text-gray-600 mt-1">{program.coach?.userId?.email || program.coach?.email}</p>
                    {program.coach.specializations && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {program.coach.specializations.map((spec, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                    {program.coach.experience && (
                      <p className="text-sm text-gray-600 mt-2">
                        {program.coach.experience} years of experience
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Program Benefits */}
            {program.benefits && program.benefits.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Gain</h2>
                <ul className="space-y-3">
                  {program.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Program Requirements */}
            {program.requirements && program.requirements.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {program.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Program Curriculum */}
            {program.curriculum && program.curriculum.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Program Curriculum</h2>
                <div className="space-y-4">
                  {program.curriculum.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                          Week {item.week}
                        </span>
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                          Session {item.session}
                        </span>
                        {item.duration && (
                          <span className="text-gray-600 text-sm">{item.duration} minutes</span>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                      {item.objectives && item.objectives.length > 0 && (
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {item.objectives.map((objective, objIndex) => (
                            <li key={objIndex}>{objective}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Program Materials */}
            {program.materials && program.materials.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Materials</h3>
                <div className="space-y-3">
                  {program.materials.map((material, index) => {
                    const IconComponent = getMaterialIcon(material.type);
                    return (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <IconComponent className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {material.title}
                          </h4>
                          {material.description && (
                            <p className="text-xs text-gray-600 mt-1">{material.description}</p>
                          )}
                          {material.url && (
                            <a
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-700 mt-1 inline-flex items-center space-x-1"
                            >
                              <span>View</span>
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Program Dates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Schedule</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="text-blue-600" size={20} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Start Date</div>
                    <div className="text-sm text-gray-600">
                      {new Date(program.startDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="text-blue-600" size={20} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">End Date</div>
                    <div className="text-sm text-gray-600">
                      {new Date(program.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Need Help?</h3>
              <p className="text-sm text-blue-700 mb-4">
                Have questions about this program? Contact our support team for assistance.
              </p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {program && (
        <EnrollmentModal
          isOpen={showEnrollmentModal}
          onClose={() => setShowEnrollmentModal(false)}
          program={program}
          onSuccess={handleEnrollmentSuccess}
        />
      )}

      {/* Success Notification */}
      <SuccessNotification
        isVisible={showSuccessNotification}
        onClose={() => setShowSuccessNotification(false)}
        title="Enrollment Successful!"
        message={`You have successfully enrolled in ${program?.title}. You will be redirected to your profile shortly.`}
        actionText="View My Profile"
        actionLink="/profile"
      />
    </div>
  );
};

export default ProgramDetails;
