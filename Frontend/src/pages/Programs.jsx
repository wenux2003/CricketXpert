import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  User, 
  Star, 
  Filter, 
  Search, 
  ChevronDown,
  Loader2,
  AlertCircle,
  BookOpen,
  Users,
  Target
} from 'lucide-react';
import { programsAPI } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    specialization: '',
    difficulty: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    totalPages: 1,
    totalDocs: 0
  });

  const { isAuthenticated, isCustomer } = useAuth();

  useEffect(() => {
    fetchPrograms();
  }, [filters, pagination.page]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await programsAPI.getAll(params);
      
      if (response.success) {
        setPrograms(response.data.docs || []);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.totalPages || 1,
          totalDocs: response.data.totalDocs || 0
        }));
      } else {
        throw new Error(response.message || 'Failed to fetch programs');
      }
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError(err.message);
      toast.error('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      specialization: '',
      difficulty: '',
      search: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const getCategoryIcon = (specialization) => {
    switch (specialization) {
      case 'batting': return Target;
      case 'bowling': return BookOpen;
      case 'fielding': return Users;
      default: return BookOpen;
    }
  };

  if (loading && programs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-sm sm:text-base">Loading programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Coaching Programs</h1>
            <p className="mt-2 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto md:mx-0">
              Discover our comprehensive cricket coaching programs designed for all skill levels
            </p>
            {pagination.totalDocs > 0 && (
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Showing {programs.length} of {pagination.totalDocs} programs
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Filter size={18} />
                <span className="text-sm">Filter</span>
                <ChevronDown 
                  size={14} 
                  className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} 
                />
              </button>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
              {/* Search */}
              <div className="sm:col-span-2 lg:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search programs..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[44px]"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[44px]"
                >
                  <option value="">All Categories</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="professional">Professional</option>
                </select>
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <select
                  value={filters.specialization}
                  onChange={(e) => handleFilterChange('specialization', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[44px]"
                >
                  <option value="">All Specializations</option>
                  <option value="batting">Batting</option>
                  <option value="bowling">Bowling</option>
                  <option value="fielding">Fielding</option>
                  <option value="wicket-keeping">Wicket Keeping</option>
                  <option value="all-rounder">All Rounder</option>
                  <option value="fitness">Fitness</option>
                  <option value="mental-coaching">Mental Coaching</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[44px]"
                >
                  <option value="">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {(filters.search || filters.category || filters.specialization || filters.difficulty) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 sm:mb-8 bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-medium text-red-800">Error Loading Programs</h3>
                <p className="text-red-600 mt-1 text-sm sm:text-base break-words">{error}</p>
                <button
                  onClick={fetchPrograms}
                  className="mt-3 bg-red-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base min-h-[44px]"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Programs Grid */}
        {!error && (
          <>
            {programs.length === 0 ? (
              <div className="text-center py-12 px-4">
                <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No programs found</h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-md mx-auto">
                  Try adjusting your filters or search terms to find programs that match your interests.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base min-h-[44px]"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {programs.map((program) => {
                  const IconComponent = getCategoryIcon(program.specialization);
                  return (
                    <div key={program._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      {/* Program Image */}
                      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-blue-500 to-blue-600">
                        {program.imageUrl ? (
                          <img
                            src={program.imageUrl}
                            alt={program.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <IconComponent className="text-white" size={40} />
                          </div>
                        )}
                        
                        {/* Difficulty Badge */}
                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(program.difficulty)}`}>
                            {program.difficulty?.charAt(0).toUpperCase() + program.difficulty?.slice(1)}
                          </span>
                        </div>

                        {/* Availability Badge */}
                        <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            program.isFull ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {program.isFull ? 'Full' : 'Available'}
                          </span>
                        </div>
                      </div>

                      {/* Program Content */}
                      <div className="p-4 sm:p-6">
                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {program.category?.charAt(0).toUpperCase() + program.category?.slice(1)}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            {program.specialization?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                          {program.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">
                          {program.description}
                        </p>

                        {/* Program Info */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                            <Clock size={14} className="flex-shrink-0" />
                            <span className="truncate">{program.duration?.weeks} weeks • {program.duration?.sessionsPerWeek} sessions/week</span>
                          </div>
                          
                          {program.coach && (
                            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                              <User size={14} className="flex-shrink-0" />
                              <span className="truncate">Coach: {program.coach?.userId ? `${program.coach.userId.firstName} ${program.coach.userId.lastName}` : 'Professional Coach'}</span>
                            </div>
                          )}

                          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                            <Users size={14} className="flex-shrink-0" />
                            <span>{program.currentEnrollments || 0}/{program.maxParticipants} enrolled</span>
                          </div>
                        </div>

                        {/* Price and Action */}
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <span className="text-lg sm:text-2xl font-bold text-gray-900">
                              {formatPrice(program.price)}
                            </span>
                          </div>
                          
                          <Link
                            to={`/programs/${program._id}`}
                            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base min-h-[44px] flex items-center"
                          >
                            See More
                          </Link>
                        </div>

                        {/* Enroll Button for Customers */}
                        {isAuthenticated && isCustomer() && !program.isFull && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <Link
                              to={`/programs/${program._id}`}
                              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium text-center block text-sm sm:text-base min-h-[44px] flex items-center justify-center"
                            >
                              Enroll Now
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 sm:mt-12 flex items-center justify-center">
                <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center"
                  >
                    Previous
                  </button>

                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = index + 1;
                      } else {
                        // Show pages around current page
                        const start = Math.max(1, pagination.page - 2);
                        const end = Math.min(pagination.totalPages, start + 4);
                        pageNum = start + index;
                        if (pageNum > end) return null;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md min-h-[44px] flex items-center ${
                            pageNum === pagination.page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Programs;

