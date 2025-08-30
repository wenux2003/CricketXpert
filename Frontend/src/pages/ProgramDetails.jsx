import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Users, 
  DollarSign,
  Calendar,
  MapPin,
  BookOpen,
  Award,
  Download,
  ChevronRight,
  Play,
  FileText,
  Link as LinkIcon
} from 'lucide-react';
import apiService from '../services/api';

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [enrollments, setEnrollments] = useState([]);

  // Mock user data - in real app, this would come from authentication context
  const user = {
    id: '60f1b2b0b3b4b4b4b4b4b4b4',
    name: 'John Doe',
    role: 'customer'
  };

  useEffect(() => {
    fetchProgramDetails();
  }, [id]);

  const fetchProgramDetails = async () => {
    setLoading(true);
    try {
      const response = await apiService.getCoachingProgramById(id);
      setProgram(response.data);
      
      // Also fetch enrollment data
      if (response.data) {
        const enrollmentResponse = await apiService.getProgramEnrollments(id);
        setEnrollments(enrollmentResponse.data || []);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch program details');
      console.error('Error fetching program details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollClick = () => {
    navigate(`/programs/${id}/enroll`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(price);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category) => {
    const colors = {
      beginner: 'bg-blue-100 text-blue-800',
      intermediate: 'bg-purple-100 text-purple-800',
      advanced: 'bg-orange-100 text-orange-800',
      professional: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getFileTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Play size={16} className="text-red-500" />;
      case 'document':
        return <FileText size={16} className="text-blue-500" />;
      case 'link':
        return <LinkIcon size={16} className="text-green-500" />;
      default:
        return <Download size={16} className="text-gray-500" />;
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BookOpen },
    { id: 'curriculum', name: 'Curriculum', icon: Calendar },
    { id: 'materials', name: 'Materials', icon: Download },
    { id: 'coach', name: 'Coach', icon: Award }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
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

  if (error || !program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Program not found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/programs')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  const availableSpots = program.maxParticipants - (program.currentEnrollments || 0);
  const isAvailable = availableSpots > 0 && program.isActive;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/programs')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Programs</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Program Header */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(program.category)}`}>
                  {program.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(program.difficulty)}`}>
                  {program.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {program.specialization?.replace('-', ' ')}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{program.title}</h1>
              <p className="text-gray-600 text-lg mb-6">{program.description}</p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="mx-auto text-blue-600 mb-2" size={24} />
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">{program.duration?.weeks} weeks</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="mx-auto text-green-600 mb-2" size={24} />
                  <p className="text-sm text-gray-600">Sessions</p>
                  <p className="font-semibold">{program.duration?.sessionsPerWeek}x/week</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users className="mx-auto text-purple-600 mb-2" size={24} />
                  <p className="text-sm text-gray-600">Enrolled</p>
                  <p className="font-semibold">{program.currentEnrollments || 0}/{program.maxParticipants}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <DollarSign className="mx-auto text-yellow-600 mb-2" size={24} />
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-semibold">{formatPrice(program.price)}</p>
                </div>
              </div>
            </div>

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
                  <div className="space-y-6">
                    {program.benefits && program.benefits.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">What You'll Learn</h3>
                        <ul className="space-y-2">
                          {program.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <ChevronRight className="text-green-500 mt-0.5" size={16} />
                              <span className="text-gray-700">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {program.requirements && program.requirements.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                        <ul className="space-y-2">
                          {program.requirements.map((requirement, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <ChevronRight className="text-blue-500 mt-0.5" size={16} />
                              <span className="text-gray-700">{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Curriculum Tab */}
                {activeTab === 'curriculum' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Curriculum</h3>
                    {program.curriculum && program.curriculum.length > 0 ? (
                      <div className="space-y-4">
                        {program.curriculum.map((item, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">
                                Week {item.week}, Session {item.session}: {item.title}
                              </h4>
                              <span className="text-sm text-gray-500">{item.duration} min</span>
                            </div>
                            {item.objectives && item.objectives.length > 0 && (
                              <ul className="space-y-1">
                                {item.objectives.map((objective, objIndex) => (
                                  <li key={objIndex} className="text-sm text-gray-600 flex items-start space-x-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{objective}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">Curriculum details will be provided upon enrollment.</p>
                    )}
                  </div>
                )}

                {/* Materials Tab */}
                {activeTab === 'materials' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Materials</h3>
                    {program.materials && program.materials.length > 0 ? (
                      <div className="space-y-3">
                        {program.materials.map((material, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center space-x-3">
                              {getFileTypeIcon(material.type)}
                              <div>
                                <h4 className="font-medium text-gray-900">{material.title}</h4>
                                {material.description && (
                                  <p className="text-sm text-gray-600">{material.description}</p>
                                )}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500 capitalize">{material.type}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">Course materials will be provided upon enrollment.</p>
                    )}
                  </div>
                )}

                {/* Coach Tab */}
                {activeTab === 'coach' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Coach</h3>
                    {program.coach && (
                      <div className="flex items-start space-x-4">
                        <img
                          src={program.coach.userId?.profileImageURL || '/api/placeholder/80/80'}
                          alt="Coach"
                          className="w-20 h-20 rounded-full bg-gray-300"
                        />
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-900">
                            {program.coach.userId?.firstName} {program.coach.userId?.lastName}
                          </h4>
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex items-center space-x-1">
                              <Star className="text-yellow-400 fill-current" size={16} />
                              <span className="font-medium">{program.coach.rating?.toFixed(1)}</span>
                              <span className="text-gray-600">({program.coach.totalReviews} reviews)</span>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{program.coach.bio}</p>
                          <div className="flex flex-wrap gap-2">
                            {program.coach.specializations?.map((spec, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                {spec.replace('-', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {formatPrice(program.price)}
                </div>
                <p className="text-gray-600">Full program fee</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available spots:</span>
                  <span className="font-semibold text-gray-900">{availableSpots}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Start date:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(program.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">End date:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(program.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {isAvailable ? (
                <button
                  onClick={handleEnrollClick}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Enroll Now
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-md cursor-not-allowed font-medium"
                >
                  {program.isActive ? 'Program Full' : 'Program Unavailable'}
                </button>
              )}

              <p className="text-xs text-gray-500 text-center mt-3">
                30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;
