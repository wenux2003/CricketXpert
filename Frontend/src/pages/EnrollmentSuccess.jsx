import React, { useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Download, 
  Calendar, 
  Mail, 
  MessageCircle,
  ArrowRight,
  Star
} from 'lucide-react';

const EnrollmentSuccess = () => {
  const { enrollmentId } = useParams();
  const location = useLocation();
  const { enrollment, program, paymentId } = location.state || {};

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // If no state data, show generic success message
  if (!enrollment || !program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Enrollment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your enrollment has been processed successfully. You should receive a confirmation email shortly.
          </p>
          <div className="space-y-3">
            <Link
              to="/profile"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              View My Profile
            </Link>
            <Link
              to="/programs"
              className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors"
            >
              Browse More Programs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enrollment Successful!</h1>
          <p className="text-lg text-gray-600">
            Welcome to your cricket coaching journey with CricketXpert
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrollment Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Enrollment Details</h2>
              
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={program.imageUrl || '/api/placeholder/80/80'}
                    alt={program.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{program.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{program.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{program.duration?.weeks} weeks</span>
                      <span>•</span>
                      <span>{program.duration?.sessionsPerWeek} sessions/week</span>
                      <span>•</span>
                      <span className="capitalize">{program.specialization}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Enrollment Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Enrollment ID:</span>
                      <span className="font-medium">#{enrollment._id.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Enrollment Date:</span>
                      <span className="font-medium">{formatDate(enrollment.enrollmentDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        {enrollment.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Sessions:</span>
                      <span className="font-medium">{enrollment.progress.totalSessions}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Payment Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment ID:</span>
                      <span className="font-medium">#{paymentId?.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-medium">{formatPrice(program.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Processing
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Date:</span>
                      <span className="font-medium">{formatDate(new Date())}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">What happens next?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Confirmation Email</h4>
                    <p className="text-blue-800 text-sm">
                      You'll receive a confirmation email with your enrollment details and receipt.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Payment Processing</h4>
                    <p className="text-blue-800 text-sm">
                      Your payment is being processed. You'll be notified once it's confirmed.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Coach Contact</h4>
                    <p className="text-blue-800 text-sm">
                      Your coach will contact you within 24 hours to schedule your first session.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Start Training</h4>
                    <p className="text-blue-800 text-sm">
                      Begin your cricket coaching journey and track your progress in your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <ArrowRight size={16} />
                  <span>View My Profile</span>
                </Link>
                
                <button className="flex items-center space-x-2 w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors">
                  <Download size={16} />
                  <span>Download Receipt</span>
                </button>
                
                <Link
                  to="/sessions"
                  className="flex items-center space-x-2 w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Calendar size={16} />
                  <span>Schedule Sessions</span>
                </Link>
                
                <button className="flex items-center space-x-2 w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors">
                  <Mail size={16} />
                  <span>Contact Support</span>
                </button>
              </div>

              <hr className="my-6" />

              {/* Coach Information */}
              {program.coach && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Your Coach</h4>
                  <div className="flex items-center space-x-3">
                    <img
                      src={program.coach.userId?.profileImageURL || '/api/placeholder/40/40'}
                      alt="Coach"
                      className="w-10 h-10 rounded-full bg-gray-300"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {program.coach.userId?.firstName} {program.coach.userId?.lastName}
                      </p>
                      <div className="flex items-center space-x-1">
                        <Star className="text-yellow-400 fill-current" size={12} />
                        <span className="text-sm text-gray-600">
                          {program.coach.rating?.toFixed(1)} ({program.coach.totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center space-x-2 w-full mt-3 bg-green-100 text-green-700 py-2 px-3 rounded-md hover:bg-green-200 transition-colors text-sm">
                    <MessageCircle size={14} />
                    <span>Message Coach</span>
                  </button>
                </div>
              )}

              <hr className="my-6" />

              {/* Program Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Program Schedule</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{formatDate(program.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">{formatDate(program.endDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{program.duration?.weeks} weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sessions/Week:</span>
                    <span className="font-medium">{program.duration?.sessionsPerWeek}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Save this page or take a screenshot for your records. 
                  You can also find all details in your profile dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Have questions about your enrollment? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Link
              to="/programs"
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors"
            >
              Browse More Programs
            </Link>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentSuccess;
