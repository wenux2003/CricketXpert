import React, { useState, useEffect } from 'react';
import { 
  User, 
  Star, 
  Clock, 
  Award, 
  BookOpen, 
  Users, 
  MapPin,
  Filter,
  Search,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Target,
  Calendar
} from 'lucide-react';
import { coachesAPI, programsAPI } from '../services/apiService';
import toast from 'react-hot-toast';

const CoachProfiles = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [expandedCoaches, setExpandedCoaches] = useState({});

  const specializations = [
    'batting',
    'bowling', 
    'fielding',
    'wicket-keeping',
    'all-rounder',
    'fitness',
    'mental-coaching'
  ];

  useEffect(() => {
    fetchCoaches();
  }, [searchTerm, selectedSpecialization, sortBy]);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        search: searchTerm || undefined,
        specialization: selectedSpecialization || undefined,
        sortBy,
        sortOrder: 'desc',
        isActive: true
      };

      const response = await coachesAPI.getAll(params);
      
      if (response.success) {
        // Backend now includes assigned programs in the response
        setCoaches(response.data.docs || []);
      } else {
        throw new Error(response.message || 'Failed to fetch coaches');
      }
    } catch (err) {
      console.error('Error fetching coaches:', err);
      setError(err.message);
      toast.error('Failed to load coach profiles');
    } finally {
      setLoading(false);
    }
  };

  const toggleCoachExpansion = (coachId) => {
    setExpandedCoaches(prev => ({
      ...prev,
      [coachId]: !prev[coachId]
    }));
  };

  const formatSpecialization = (spec) => {
    return spec.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={16} className="text-yellow-400 fill-current" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} size={16} className="text-yellow-400 fill-current opacity-50" />
        );
      } else {
        stars.push(
          <Star key={i} size={16} className="text-gray-300" />
        );
      }
    }

    return <div className="flex space-x-1">{stars}</div>;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('');
    setSortBy('rating');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">Coach Profiles</h1>
              <p className="mt-2 text-lg text-gray-600">
                Explore our experienced coaches and their specialized programs
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Coaches</p>
                  <p className="text-2xl font-bold text-blue-600">{coaches.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Active Programs</p>
                  <p className="text-2xl font-bold text-green-600">
                    {coaches.reduce((total, coach) => total + (coach.assignedPrograms?.length || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search coaches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Specialization Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>
                    {formatSpecialization(spec)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="rating">Sort by Rating</option>
                <option value="experience">Sort by Experience</option>
                <option value="hourlyRate">Sort by Price</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div>
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading coach profiles...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Error Loading Profiles</h4>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchCoaches}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : coaches.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Coaches Found</h4>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedSpecialization 
                ? 'Try adjusting your search criteria'
                : 'No coaches available at the moment'
              }
            </p>
            {(searchTerm || selectedSpecialization) && (
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {coaches.map((coach) => {
              const isExpanded = expandedCoaches[coach._id];
              const assignedPrograms = coach.assignedPrograms || [];

              return (
                <div key={coach._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  {/* Coach Header */}
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Profile Image */}
                      <div className="flex-shrink-0">
                        {coach.profileImage || coach.userId?.profileImageURL ? (
                          <img
                            src={coach.profileImage || coach.userId?.profileImageURL}
                            alt={`${coach.userId?.firstName} ${coach.userId?.lastName}`}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="text-blue-600" size={24} />
                          </div>
                        )}
                      </div>

                      {/* Coach Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {coach.userId?.firstName} {coach.userId?.lastName}
                            </h3>
                            
                            {/* Rating */}
                            <div className="flex items-center space-x-2 mt-1">
                              {renderStarRating(coach.rating || 0)}
                              <span className="text-sm text-gray-600">
                                {coach.rating?.toFixed(1) || '0.0'} ({coach.totalReviews || 0} reviews)
                              </span>
                            </div>

                            {/* Specializations */}
                            <div className="flex flex-wrap gap-2 mt-3">
                              {(coach.specializations || []).map((spec) => (
                                <span
                                  key={spec}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {formatSpecialization(spec)}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Stats & Actions */}
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Clock size={16} />
                                  <span>{coach.experience || 0} years</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <BookOpen size={16} />
                                  <span>{assignedPrograms.length} programs</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="font-medium">${coach.hourlyRate || 0}/hr</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => toggleCoachExpansion(coach._id)}
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                          </div>
                        </div>

                        {/* Bio */}
                        {coach.bio && (
                          <p className="mt-3 text-gray-600 text-sm line-clamp-2">
                            {coach.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-6 space-y-6">
                      {/* Achievements */}
                      {coach.achievements && coach.achievements.length > 0 && (
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                            <Award className="mr-2" size={20} />
                            Achievements
                          </h4>
                          <div className="grid gap-2">
                            {coach.achievements.map((achievement, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Award className="text-yellow-500" size={16} />
                                <span className="text-gray-700">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certifications */}
                      {coach.certifications && coach.certifications.length > 0 && (
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                            <Award className="mr-2" size={20} />
                            Certifications
                          </h4>
                          <div className="grid gap-3">
                            {coach.certifications.map((cert, index) => (
                              <div key={index} className="bg-gray-50 rounded-lg p-3">
                                <h5 className="font-medium text-gray-900">{cert.name}</h5>
                                <p className="text-sm text-gray-600">
                                  Issued by: {cert.issuedBy}
                                  {cert.dateIssued && (
                                    <span className="ml-2">
                                      ({new Date(cert.dateIssued).getFullYear()})
                                    </span>
                                  )}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Assigned Programs */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                          <BookOpen className="mr-2" size={20} />
                          Assigned Programs ({assignedPrograms.length})
                        </h4>
                        {assignedPrograms.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">No programs assigned yet</p>
                        ) : (
                          <div className="grid gap-4 md:grid-cols-2">
                            {assignedPrograms.map((program) => (
                              <div key={program._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-start justify-between mb-2">
                                  <h5 className="font-medium text-gray-900 line-clamp-1">
                                    {program.title}
                                  </h5>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    program.isActive 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {program.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                  {program.description}
                                </p>
                                
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-1">
                                      <Users size={12} />
                                      <span>{program.currentEnrollments || 0}/{program.maxParticipants || 0}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Calendar size={12} />
                                      <span>{program.duration?.weeks || 0}w</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Target size={12} />
                                      <span>{formatSpecialization(program.category || '')}</span>
                                    </div>
                                  </div>
                                  <span className="font-medium">${program.price || 0}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Availability */}
                      {coach.availability && coach.availability.length > 0 && (
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                            <Clock className="mr-2" size={20} />
                            Availability
                          </h4>
                          <div className="grid gap-2 md:grid-cols-2">
                            {coach.availability.map((slot, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-2">
                                <span className="font-medium text-gray-900">{slot.dayOfWeek}</span>
                                <span className="text-sm text-gray-600">
                                  {slot.startTime} - {slot.endTime}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachProfiles;
