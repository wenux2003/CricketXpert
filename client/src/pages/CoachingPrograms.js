import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coachingProgramsAPI } from '../services/api';
import './CoachingPrograms.css';

const CoachingPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    specialization: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPrograms: 0
  });

  const categories = ['beginner', 'intermediate', 'advanced', 'professional'];
  const specializations = ['batting', 'bowling', 'fielding', 'wicket-keeping', 'all-rounder', 'fitness', 'mental-coaching'];

  useEffect(() => {
    fetchPrograms();
  }, [filters, pagination.currentPage]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.currentPage,
        limit: 9
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await coachingProgramsAPI.getPrograms(params);
      const { data, pagination: paginationData } = response.data;

      setPrograms(data);
      setPagination(paginationData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch coaching programs');
      console.error('Error fetching programs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(price);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#27ae60';
      case 'medium': return '#f39c12';
      case 'hard': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'beginner': return '#3498db';
      case 'intermediate': return '#9b59b6';
      case 'advanced': return '#e67e22';
      case 'professional': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  if (loading && programs.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading coaching programs...</p>
      </div>
    );
  }

  return (
    <div className="coaching-programs-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>Coaching Programs</h1>
          <p>Discover our comprehensive cricket coaching programs designed to elevate your game</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="filter-group">
              <label>Category</label>
              <select 
                value={filters.category} 
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Specialization</label>
              <select 
                value={filters.specialization} 
                onChange={(e) => handleFilterChange('specialization', e.target.value)}
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>
                    {spec.charAt(0).toUpperCase() + spec.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select 
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                }}
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="title-asc">Name: A to Z</option>
              </select>
            </div>

            <div className="filter-group search-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search programs..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <p>
            Showing {programs.length} of {pagination.totalPrograms} programs
          </p>
        </div>

        {/* Programs Grid */}
        {error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchPrograms} className="retry-btn">
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="programs-grid">
              {programs.map(program => (
                <div key={program._id} className="program-card">
                  <div className="program-image">
                    <img 
                      src={program.imageUrl || '/default-program.jpg'} 
                      alt={program.title}
                      onError={(e) => {
                        e.target.src = '/default-program.jpg';
                      }}
                    />
                    <div className="program-badges">
                      <span 
                        className="category-badge"
                        style={{ backgroundColor: getCategoryColor(program.category) }}
                      >
                        {program.category}
                      </span>
                      <span 
                        className="difficulty-badge"
                        style={{ backgroundColor: getDifficultyColor(program.difficulty) }}
                      >
                        {program.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="program-content">
                    <h3 className="program-title">{program.title}</h3>
                    <p className="program-description">
                      {program.description.length > 120 
                        ? `${program.description.substring(0, 120)}...` 
                        : program.description}
                    </p>

                    <div className="program-meta">
                      <div className="meta-item">
                        <span className="meta-label">Specialization:</span>
                        <span className="meta-value">{program.specialization.replace('-', ' ')}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Duration:</span>
                        <span className="meta-value">
                          {program.duration.weeks} weeks ({program.duration.sessionsPerWeek} sessions/week)
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Max Participants:</span>
                        <span className="meta-value">{program.maxParticipants}</span>
                      </div>
                    </div>

                    <div className="program-coach">
                      <span className="coach-label">Coach:</span>
                      <span className="coach-name">
                        {program.coach?.userId?.firstName} {program.coach?.userId?.lastName}
                      </span>
                      {program.coach?.rating && (
                        <div className="coach-rating">
                          <span className="rating-stars">
                            {'★'.repeat(Math.floor(program.coach.rating))}
                            {'☆'.repeat(5 - Math.floor(program.coach.rating))}
                          </span>
                          <span className="rating-value">({program.coach.rating.toFixed(1)})</span>
                        </div>
                      )}
                    </div>

                    <div className="program-footer">
                      <div className="program-price">
                        <span className="price-label">Price:</span>
                        <span className="price-value">{formatPrice(program.price)}</span>
                      </div>
                      <Link 
                        to={`/programs/${program._id}`} 
                        className="view-details-btn"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="page-btn"
                >
                  Previous
                </button>

                {[...Array(pagination.totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`page-btn ${pagination.currentPage === page ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button 
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="page-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {programs.length === 0 && !loading && !error && (
          <div className="no-results">
            <h3>No programs found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachingPrograms;














